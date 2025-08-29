// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {EvidenceRegistry} from "../src/EvidenceRegistry.sol";

contract EvidenceRegistryFuzzTest is Test {
    EvidenceRegistry public registry;
    
    address public owner;
    address public policy;
    address public watcher;
    address public publisher;

    bytes32 public constant TEST_CID = keccak256("QmTestCID123");

    function setUp() public {
        owner = address(this);
        policy = address(0x1);
        watcher = address(0x2);
        publisher = address(0x3);

        registry = new EvidenceRegistry(policy, watcher);
        
        // Register a test CID
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 2,
            n: 3,
            timeout: 2000,
            window: 5
        });
        vm.prank(publisher);
        registry.registerCID(TEST_CID, slo, true);
    }

    /**
     * @dev Fuzz test: Nonce must be monotonic
     */
    function testFuzz_MonotonicNonce(uint64[] memory nonces) public {
        vm.assume(nonces.length > 1);
        vm.assume(nonces.length <= 10); // Reasonable bound
        
        uint64 expectedNonce = 1;
        
        for (uint256 i = 0; i < nonces.length; i++) {
            EvidenceRegistry.PackRef memory pack = EvidenceRegistry.PackRef({
                cidDigest: TEST_CID,
                packCIDDigest: keccak256(abi.encodePacked("pack", i)),
                ts: uint64(block.timestamp + i * 60),
                status: 0, // OK
                nonce: nonces[i]
            });

            vm.warp(block.timestamp + i * 60);
            vm.prank(watcher);
            
            if (nonces[i] == expectedNonce) {
                // Should succeed
                registry.reportPack(pack);
                expectedNonce++;
            } else {
                // Should revert
                vm.expectRevert("Invalid nonce: must be sequential");
                registry.reportPack(pack);
                break; // Stop testing after first failure
            }
        }
    }

    /**
     * @dev Fuzz test: Stake should never go negative
     */
    function testFuzz_StakeNeverNegative(
        uint256 bondAmount1,
        uint256 bondAmount2,
        uint256 slashAmount
    ) public {
        bondAmount1 = bound(bondAmount1, 0.01 ether, 5 ether);
        bondAmount2 = bound(bondAmount2, 0.01 ether, 5 ether);
        
        address staker = address(0x999);
        vm.deal(staker, 1000 ether);
        
        // Bond stake
        vm.startPrank(staker);
        registry.bondStake{value: bondAmount1}(TEST_CID);
        registry.bondStake{value: bondAmount2}(TEST_CID);
        vm.stopPrank();
        
        uint256 totalStake = bondAmount1 + bondAmount2;
        slashAmount = bound(slashAmount, 0, totalStake);
        
        EvidenceRegistry.CIDState memory stateBefore = registry.getCIDState(TEST_CID);
        assertEq(stateBefore.totalStake, totalStake);
        
        if (slashAmount > 0) {
            vm.prank(policy);
            registry.slash(TEST_CID, slashAmount);
            
            EvidenceRegistry.CIDState memory stateAfter = registry.getCIDState(TEST_CID);
            assertEq(stateAfter.totalStake, totalStake - slashAmount);
            assertGe(stateAfter.totalStake, 0); // Never negative
        }
    }

    /**
     * @dev Fuzz test: Timestamps should not go backwards after breach
     */
    function testFuzz_TimestampMonotonicAfterBreach(uint64[] memory timestamps) public {
        vm.assume(timestamps.length > 1);
        vm.assume(timestamps.length <= 10);
        
        // First, cause a breach
        vm.warp(1000);
        EvidenceRegistry.PackRef memory breachPack = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: keccak256("breach_pack"),
            ts: uint64(block.timestamp),
            status: 2, // BREACH
            nonce: 1
        });
        
        vm.prank(watcher);
        registry.reportPack(breachPack);
        
        uint64 lastBreachTime = uint64(block.timestamp);
        uint64 currentNonce = 2;
        
        // Now try to report with various timestamps
        for (uint256 i = 0; i < timestamps.length; i++) {
            // Bound timestamp to reasonable range
            uint64 ts = uint64(bound(timestamps[i], 0, type(uint32).max));
            
            EvidenceRegistry.PackRef memory pack = EvidenceRegistry.PackRef({
                cidDigest: TEST_CID,
                packCIDDigest: keccak256(abi.encodePacked("pack", i)),
                ts: ts,
                status: 0, // OK
                nonce: currentNonce
            });
            
            vm.prank(watcher);
            
            if (ts >= lastBreachTime) {
                // Should succeed
                registry.reportPack(pack);
                currentNonce++;
            } else {
                // Should revert due to timestamp being before last breach
                vm.expectRevert("Timestamp cannot be before last breach");
                registry.reportPack(pack);
                break; // Stop after first failure
            }
        }
    }

    /**
     * @dev Fuzz test: SLO parameters validation
     */
    function testFuzz_SLOValidation(uint8 k, uint8 n, uint16 timeout, uint16 window) public {
        bytes32 fuzzCID = keccak256(abi.encodePacked("fuzz", k, n));
        
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: k,
            n: n,
            timeout: timeout,
            window: window
        });
        
        vm.prank(publisher);
        
        if (k == 0 || k > n || n > 5) {
            // Should revert
            vm.expectRevert();
            registry.registerCID(fuzzCID, slo, true);
        } else {
            // Should succeed
            registry.registerCID(fuzzCID, slo, true);
            
            EvidenceRegistry.CIDState memory state = registry.getCIDState(fuzzCID);
            assertEq(state.slo.k, k);
            assertEq(state.slo.n, n);
            assertEq(state.slo.timeout, timeout);
            assertEq(state.slo.window, window);
        }
    }

    /**
     * @dev Fuzz test: Bond amounts should accumulate correctly
     */
    function testFuzz_BondAccumulation(uint256[] memory amounts) public {
        vm.assume(amounts.length > 0);
        vm.assume(amounts.length <= 20);
        
        address staker = address(0x888);
        vm.deal(staker, 10000 ether);
        
        uint256 expectedTotal = 0;
        
        for (uint256 i = 0; i < amounts.length; i++) {
            uint256 amount = bound(amounts[i], 0.001 ether, 1 ether);
            
            vm.prank(staker);
            registry.bondStake{value: amount}(TEST_CID);
            
            expectedTotal += amount;
            
            EvidenceRegistry.CIDState memory state = registry.getCIDState(TEST_CID);
            assertEq(state.totalStake, expectedTotal);
        }
    }

    /**
     * @dev Fuzz test: Consecutive fails counter behavior
     */
    function testFuzz_ConsecutiveFailsCounter(uint8[] memory statuses) public {
        vm.assume(statuses.length > 0);
        vm.assume(statuses.length <= 20);
        
        uint8 expectedFails = 0;
        uint64 currentNonce = 1;
        
        for (uint256 i = 0; i < statuses.length; i++) {
            uint8 status = statuses[i] % 3; // 0, 1, or 2
            
            EvidenceRegistry.PackRef memory pack = EvidenceRegistry.PackRef({
                cidDigest: TEST_CID,
                packCIDDigest: keccak256(abi.encodePacked("pack", i)),
                ts: uint64(1000 + i * 60),
                status: status,
                nonce: currentNonce
            });
            
            vm.warp(1000 + i * 60);
            vm.prank(watcher);
            registry.reportPack(pack);
            
            if (status == 2) { // BREACH
                expectedFails++;
            } else if (status == 0) { // OK
                expectedFails = 0;
            }
            // DEGRADED (1) doesn't change consecutive fails
            
            EvidenceRegistry.CIDState memory state = registry.getCIDState(TEST_CID);
            assertEq(state.consecutiveFails, expectedFails);
            
            currentNonce++;
        }
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {EvidenceRegistry} from "../src/EvidenceRegistry.sol";

contract EvidenceRegistryTest is Test {
    EvidenceRegistry public registry;
    
    address public owner;
    address public policy;
    address public watcher;
    address public publisher;
    address public staker;

    bytes32 public constant TEST_CID = keccak256("QmTestCID123");
    bytes32 public constant TEST_PACK_CID = keccak256("QmTestPackCID456");

    event CIDRegistered(
        bytes32 indexed cid, 
        address indexed publisher, 
        EvidenceRegistry.SLO slo, 
        bool slashing
    );
    
    event StakeBonded(
        bytes32 indexed cid, 
        address indexed staker, 
        uint256 amount
    );
    
    event EvidenceAnchored(
        bytes32 indexed cid, 
        bytes32 indexed packCID, 
        uint8 status, 
        uint64 nonce
    );
    
    event BreachDetected(
        bytes32 indexed cid, 
        uint64 at
    );
    
    event Slashed(
        bytes32 indexed cid, 
        uint256 amount, 
        address indexed by
    );

    function setUp() public {
        owner = address(this);
        policy = address(0x1);
        watcher = address(0x2);
        publisher = address(0x3);
        staker = address(0x4);

        registry = new EvidenceRegistry(policy, watcher);
        
        // Fund test accounts
        vm.deal(staker, 10 ether);
        vm.deal(publisher, 1 ether);
    }

    // ========== Constructor Tests ==========

    function testConstructorSuccess() public view {
        assertTrue(registry.hasRole(registry.DEFAULT_ADMIN_ROLE(), owner));
        assertTrue(registry.hasRole(registry.POLICY_ROLE(), policy));
        assertTrue(registry.hasRole(registry.WATCHER_ROLE(), watcher));
    }

    function testConstructorZeroAddressPolicy() public {
        vm.expectRevert("Policy address cannot be zero");
        new EvidenceRegistry(address(0), watcher);
    }

    function testConstructorZeroAddressWatcher() public {
        vm.expectRevert("Watcher address cannot be zero");
        new EvidenceRegistry(policy, address(0));
    }

    // ========== registerCID Tests ==========

    function testRegisterCIDSuccess() public {
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 2,
            n: 3,
            timeout: 2000,
            window: 5
        });

        vm.prank(publisher);
        vm.expectEmit(true, true, false, true);
        emit CIDRegistered(TEST_CID, publisher, slo, true);
        
        registry.registerCID(TEST_CID, slo, true);

        EvidenceRegistry.CIDState memory state = registry.getCIDState(TEST_CID);
        assertEq(state.publisher, publisher);
        assertEq(state.slo.k, 2);
        assertEq(state.slo.n, 3);
        assertEq(state.slo.timeout, 2000);
        assertEq(state.slo.window, 5);
        assertTrue(state.slashingEnabled);
        assertEq(state.totalStake, 0);
        assertEq(state.nonce, 0);
    }

    function testRegisterCIDInvalidK() public {
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 0,
            n: 3,
            timeout: 2000,
            window: 5
        });

        vm.prank(publisher);
        vm.expectRevert("k must be greater than 0");
        registry.registerCID(TEST_CID, slo, true);
    }

    function testRegisterCIDKGreaterThanN() public {
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 4,
            n: 3,
            timeout: 2000,
            window: 5
        });

        vm.prank(publisher);
        vm.expectRevert("k cannot be greater than n");
        registry.registerCID(TEST_CID, slo, true);
    }

    function testRegisterCIDNTooLarge() public {
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 3,
            n: 6,
            timeout: 2000,
            window: 5
        });

        vm.prank(publisher);
        vm.expectRevert("n cannot be greater than 5");
        registry.registerCID(TEST_CID, slo, true);
    }

    function testRegisterCIDAlreadyRegistered() public {
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 2,
            n: 3,
            timeout: 2000,
            window: 5
        });

        vm.startPrank(publisher);
        registry.registerCID(TEST_CID, slo, true);
        
        vm.expectRevert("CID already registered");
        registry.registerCID(TEST_CID, slo, true);
        vm.stopPrank();
    }

    function testRegisterCIDWhenPaused() public {
        registry.pause();
        
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 2,
            n: 3,
            timeout: 2000,
            window: 5
        });

        vm.prank(publisher);
        vm.expectRevert();
        registry.registerCID(TEST_CID, slo, true);
    }

    // ========== bondStake Tests ==========

    function testBondStakeSuccess() public {
        // First register a CID
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 2,
            n: 3,
            timeout: 2000,
            window: 5
        });
        vm.prank(publisher);
        registry.registerCID(TEST_CID, slo, true);

        // Bond stake
        uint256 bondAmount = 1 ether;
        vm.prank(staker);
        vm.expectEmit(true, true, false, true);
        emit StakeBonded(TEST_CID, staker, bondAmount);
        
        registry.bondStake{value: bondAmount}(TEST_CID);

        EvidenceRegistry.CIDState memory state = registry.getCIDState(TEST_CID);
        assertEq(state.totalStake, bondAmount);
    }

    function testBondStakeZeroAmount() public {
        // First register a CID
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 2,
            n: 3,
            timeout: 2000,
            window: 5
        });
        vm.prank(publisher);
        registry.registerCID(TEST_CID, slo, true);

        vm.prank(staker);
        vm.expectRevert("Must send positive amount");
        registry.bondStake{value: 0}(TEST_CID);
    }

    function testBondStakeNonexistentCID() public {
        vm.prank(staker);
        vm.expectRevert("CID does not exist");
        registry.bondStake{value: 1 ether}(TEST_CID);
    }

    function testBondStakeWhenPaused() public {
        // First register a CID
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 2,
            n: 3,
            timeout: 2000,
            window: 5
        });
        vm.prank(publisher);
        registry.registerCID(TEST_CID, slo, true);

        registry.pause();

        vm.prank(staker);
        vm.expectRevert();
        registry.bondStake{value: 1 ether}(TEST_CID);
    }

    // ========== reportPack Tests ==========

    function testReportPackOKStatus() public {
        // Setup: register CID and bond stake
        _setupCIDWithStake();

        EvidenceRegistry.PackRef memory pack = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: TEST_PACK_CID,
            ts: uint64(block.timestamp),
            status: 0, // OK
            nonce: 1
        });

        vm.prank(watcher);
        vm.expectEmit(true, true, false, true);
        emit EvidenceAnchored(TEST_CID, TEST_PACK_CID, 0, 1);
        
        registry.reportPack(pack);

        EvidenceRegistry.CIDState memory state = registry.getCIDState(TEST_CID);
        assertEq(state.nonce, 1);
        assertEq(state.lastPackCIDDigest, TEST_PACK_CID);
        assertEq(state.consecutiveFails, 0);
    }

    function testReportPackBreachStatus() public {
        // Setup: register CID and bond stake
        _setupCIDWithStake();

        EvidenceRegistry.PackRef memory pack = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: TEST_PACK_CID,
            ts: uint64(block.timestamp),
            status: 2, // BREACH
            nonce: 1
        });

        vm.prank(watcher);
        vm.expectEmit(true, true, false, true);
        emit BreachDetected(TEST_CID, uint64(block.timestamp));
        
        registry.reportPack(pack);

        EvidenceRegistry.CIDState memory state = registry.getCIDState(TEST_CID);
        assertEq(state.consecutiveFails, 1);
        assertEq(state.lastBreachAt, block.timestamp);
    }

    function testReportPackMultipleBreaches() public {
        // Setup: register CID and bond stake
        _setupCIDWithStake();

        // First breach
        EvidenceRegistry.PackRef memory pack1 = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: TEST_PACK_CID,
            ts: uint64(block.timestamp),
            status: 2, // BREACH
            nonce: 1
        });

        vm.prank(watcher);
        registry.reportPack(pack1);

        // Second breach
        EvidenceRegistry.PackRef memory pack2 = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: keccak256("QmSecondPack"),
            ts: uint64(block.timestamp + 60),
            status: 2, // BREACH
            nonce: 2
        });

        vm.warp(block.timestamp + 60);
        vm.prank(watcher);
        registry.reportPack(pack2);

        EvidenceRegistry.CIDState memory state = registry.getCIDState(TEST_CID);
        assertEq(state.consecutiveFails, 2);
    }

    function testReportPackResetConsecutiveFails() public {
        // Setup: register CID and bond stake
        _setupCIDWithStake();

        // First breach
        EvidenceRegistry.PackRef memory pack1 = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: TEST_PACK_CID,
            ts: uint64(block.timestamp),
            status: 2, // BREACH
            nonce: 1
        });

        vm.prank(watcher);
        registry.reportPack(pack1);

        // OK status should reset consecutive fails
        EvidenceRegistry.PackRef memory pack2 = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: keccak256("QmSecondPack"),
            ts: uint64(block.timestamp + 60),
            status: 0, // OK
            nonce: 2
        });

        vm.warp(block.timestamp + 60);
        vm.prank(watcher);
        registry.reportPack(pack2);

        EvidenceRegistry.CIDState memory state = registry.getCIDState(TEST_CID);
        assertEq(state.consecutiveFails, 0);
    }

    function testReportPackUnauthorized() public {
        _setupCIDWithStake();

        EvidenceRegistry.PackRef memory pack = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: TEST_PACK_CID,
            ts: uint64(block.timestamp),
            status: 0,
            nonce: 1
        });

        vm.prank(publisher); // Not a watcher
        vm.expectRevert();
        registry.reportPack(pack);
    }

    function testReportPackInvalidNonce() public {
        _setupCIDWithStake();

        EvidenceRegistry.PackRef memory pack = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: TEST_PACK_CID,
            ts: uint64(block.timestamp),
            status: 0,
            nonce: 5 // Should be 1
        });

        vm.prank(watcher);
        vm.expectRevert("Invalid nonce: must be sequential");
        registry.reportPack(pack);
    }

    function testReportPackTimestampBeforeBreach() public {
        _setupCIDWithStake();

        // Set initial timestamp
        vm.warp(1000);

        // Report a breach first
        EvidenceRegistry.PackRef memory pack1 = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: TEST_PACK_CID,
            ts: uint64(block.timestamp),
            status: 2, // BREACH
            nonce: 1
        });

        vm.prank(watcher);
        registry.reportPack(pack1);

        // Try to report with earlier timestamp
        EvidenceRegistry.PackRef memory pack2 = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: keccak256("QmSecondPack"),
            ts: uint64(block.timestamp - 60), // Earlier timestamp
            status: 0,
            nonce: 2
        });

        vm.prank(watcher);
        vm.expectRevert("Timestamp cannot be before last breach");
        registry.reportPack(pack2);
    }

    // ========== slash Tests ==========

    function testSlashSuccess() public {
        _setupCIDWithStake();

        uint256 slashAmount = 0.5 ether;
        uint256 initialBalance = publisher.balance;

        vm.prank(policy);
        vm.expectEmit(true, false, false, true);
        emit Slashed(TEST_CID, slashAmount, policy);
        
        registry.slash(TEST_CID, slashAmount);

        EvidenceRegistry.CIDState memory state = registry.getCIDState(TEST_CID);
        assertEq(state.totalStake, 1 ether - slashAmount);
        assertEq(publisher.balance, initialBalance + slashAmount);
    }

    function testSlashZeroAmount() public {
        _setupCIDWithStake();

        vm.prank(policy);
        vm.expectRevert("Amount must be greater than 0");
        registry.slash(TEST_CID, 0);
    }

    function testSlashExceedsStake() public {
        _setupCIDWithStake();

        vm.prank(policy);
        vm.expectRevert("Amount exceeds total stake");
        registry.slash(TEST_CID, 2 ether); // More than bonded
    }

    function testSlashSlashingDisabled() public {
        // Register CID with slashing disabled
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 2,
            n: 3,
            timeout: 2000,
            window: 5
        });
        vm.prank(publisher);
        registry.registerCID(TEST_CID, slo, false); // slashing disabled

        // Bond stake
        vm.prank(staker);
        registry.bondStake{value: 1 ether}(TEST_CID);

        vm.prank(policy);
        vm.expectRevert("Slashing not enabled for this CID");
        registry.slash(TEST_CID, 0.5 ether);
    }

    function testSlashUnauthorized() public {
        _setupCIDWithStake();

        vm.prank(publisher); // Not policy role
        vm.expectRevert();
        registry.slash(TEST_CID, 0.5 ether);
    }

    // ========== Pause/Unpause Tests ==========

    function testPauseSuccess() public {
        registry.pause();
        assertTrue(registry.paused());
    }

    function testUnpauseSuccess() public {
        registry.pause();
        registry.unpause();
        assertFalse(registry.paused());
    }

    function testPauseUnauthorized() public {
        vm.prank(publisher);
        vm.expectRevert();
        registry.pause();
    }

    function testUnpauseUnauthorized() public {
        registry.pause();
        vm.prank(publisher);
        vm.expectRevert();
        registry.unpause();
    }

    function testPauseBlocksOperations() public {
        _setupCIDWithStake();
        registry.pause();

        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 2,
            n: 3,
            timeout: 2000,
            window: 5
        });

        // Test registerCID blocked
        vm.prank(publisher);
        vm.expectRevert();
        registry.registerCID(keccak256("AnotherCID"), slo, true);

        // Test bondStake blocked
        vm.prank(staker);
        vm.expectRevert();
        registry.bondStake{value: 1 ether}(TEST_CID);

        // Test reportPack blocked
        EvidenceRegistry.PackRef memory pack = EvidenceRegistry.PackRef({
            cidDigest: TEST_CID,
            packCIDDigest: TEST_PACK_CID,
            ts: uint64(block.timestamp),
            status: 0,
            nonce: 1
        });
        vm.prank(watcher);
        vm.expectRevert();
        registry.reportPack(pack);

        // Test slash blocked
        vm.prank(policy);
        vm.expectRevert();
        registry.slash(TEST_CID, 0.5 ether);
    }

    // ========== View Functions Tests ==========

    function testGetCID() public {
        _setupCIDWithStake();

        (EvidenceRegistry.SLO memory slo, uint256 totalStake, bytes32 lastPackCID) = 
            registry.getCID(TEST_CID);

        assertEq(slo.k, 2);
        assertEq(slo.n, 3);
        assertEq(totalStake, 1 ether);
        assertEq(lastPackCID, bytes32(0));
    }

    function testGetCIDState() public {
        _setupCIDWithStake();

        EvidenceRegistry.CIDState memory state = registry.getCIDState(TEST_CID);
        
        assertEq(state.publisher, publisher);
        assertEq(state.slo.k, 2);
        assertEq(state.slo.n, 3);
        assertEq(state.totalStake, 1 ether);
        assertTrue(state.slashingEnabled);
        assertEq(state.nonce, 0);
    }

    // ========== Helper Functions ==========

    function _setupCIDWithStake() internal {
        // Register CID
        EvidenceRegistry.SLO memory slo = EvidenceRegistry.SLO({
            k: 2,
            n: 3,
            timeout: 2000,
            window: 5
        });
        vm.prank(publisher);
        registry.registerCID(TEST_CID, slo, true);

        // Bond stake
        vm.prank(staker);
        registry.bondStake{value: 1 ether}(TEST_CID);
    }
}

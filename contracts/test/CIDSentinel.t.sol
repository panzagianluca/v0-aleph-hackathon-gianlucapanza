// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/CIDSentinel.sol";

contract CIDSentinelTest is Test {
    CIDSentinel public sentinel;
    address public owner;
    address public verifier;

    function setUp() public {
        owner = address(this);
        verifier = address(0x1);
        sentinel = new CIDSentinel();
    }

    function testInitialState() public {
        assertEq(sentinel.owner(), owner);
        assertTrue(sentinel.authorizedVerifiers(owner));
        assertEq(sentinel.sloCounter(), 0);
    }

    function testAuthorizeVerifier() public {
        sentinel.authorizeVerifier(verifier);
        assertTrue(sentinel.authorizedVerifiers(verifier));
    }

    function testCreateSLO() public {
        uint256 sloId = sentinel.createSLO("Test SLO", 9500, 86400, "Test description");
        assertEq(sloId, 0);
        
        (string memory name, uint256 target, uint256 window, string memory description, uint256 createdAt, bool active) = sentinel.slos(0);
        assertEq(name, "Test SLO");
        assertEq(target, 9500);
        assertEq(window, 86400);
        assertEq(description, "Test description");
        assertTrue(active);
        assertGt(createdAt, 0);
    }

    function testVerifyPackage() public {
        string memory cid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
        string memory name = "test-package";
        string memory version = "1.0.0";
        bytes32 hash = keccak256("test");
        uint256 size = 1024;
        bytes memory signature = "test-signature";

        sentinel.verifyPackage(cid, name, version, hash, size, signature);
        
        assertTrue(sentinel.isPackageVerified(cid));
        
        CIDSentinel.PackageRef memory pkg = sentinel.getPackage(cid);
        assertEq(pkg.cid, cid);
        assertEq(pkg.name, name);
        assertEq(pkg.version, version);
        assertEq(pkg.hash, hash);
        assertEq(pkg.size, size);
        assertEq(pkg.verifier, owner);
    }
}

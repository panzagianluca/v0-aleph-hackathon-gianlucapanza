// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CIDSentinel
 * @dev Smart contract for content integrity verification and SLO tracking
 */
contract CIDSentinel {
    struct PackageRef {
        string cid;
        string name;
        string version;
        bytes32 hash;
        uint256 size;
        uint256 timestamp;
        bytes signature;
        address verifier;
    }

    struct SLO {
        string name;
        uint256 target; // percentage (0-10000 for 0-100.00%)
        uint256 window; // time window in seconds
        string description;
        uint256 createdAt;
        bool active;
    }

    mapping(string => PackageRef) public packages;
    mapping(uint256 => SLO) public slos;
    mapping(address => bool) public authorizedVerifiers;
    
    uint256 public sloCounter;
    address public owner;

    event PackageVerified(string indexed cid, address indexed verifier, uint256 timestamp);
    event SLOCreated(uint256 indexed sloId, string name, uint256 target);
    event VerifierAuthorized(address indexed verifier);
    event VerifierRevoked(address indexed verifier);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorizedVerifier() {
        require(authorizedVerifiers[msg.sender], "Not an authorized verifier");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedVerifiers[msg.sender] = true;
    }

    /**
     * @dev Verify and store a package reference
     */
    function verifyPackage(
        string memory cid,
        string memory name,
        string memory version,
        bytes32 hash,
        uint256 size,
        bytes memory signature
    ) external onlyAuthorizedVerifier {
        packages[cid] = PackageRef({
            cid: cid,
            name: name,
            version: version,
            hash: hash,
            size: size,
            timestamp: block.timestamp,
            signature: signature,
            verifier: msg.sender
        });

        emit PackageVerified(cid, msg.sender, block.timestamp);
    }

    /**
     * @dev Create a new SLO
     */
    function createSLO(
        string memory name,
        uint256 target,
        uint256 window,
        string memory description
    ) external onlyOwner returns (uint256) {
        require(target <= 10000, "Target cannot exceed 100%");
        
        uint256 sloId = sloCounter++;
        slos[sloId] = SLO({
            name: name,
            target: target,
            window: window,
            description: description,
            createdAt: block.timestamp,
            active: true
        });

        emit SLOCreated(sloId, name, target);
        return sloId;
    }

    /**
     * @dev Authorize a new verifier
     */
    function authorizeVerifier(address verifier) external onlyOwner {
        authorizedVerifiers[verifier] = true;
        emit VerifierAuthorized(verifier);
    }

    /**
     * @dev Revoke verifier authorization
     */
    function revokeVerifier(address verifier) external onlyOwner {
        authorizedVerifiers[verifier] = false;
        emit VerifierRevoked(verifier);
    }

    /**
     * @dev Get package information by CID
     */
    function getPackage(string memory cid) external view returns (PackageRef memory) {
        return packages[cid];
    }

    /**
     * @dev Check if a package exists and is verified
     */
    function isPackageVerified(string memory cid) external view returns (bool) {
        return bytes(packages[cid].cid).length > 0;
    }
}

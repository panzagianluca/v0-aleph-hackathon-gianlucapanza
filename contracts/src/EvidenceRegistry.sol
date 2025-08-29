// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title EvidenceRegistry
 * @dev Smart contract for CID availability monitoring with SLO enforcement and slashing
 */
contract EvidenceRegistry is AccessControl, Pausable, ReentrancyGuard {
    // Roles
    bytes32 public constant POLICY_ROLE = keccak256("POLICY_ROLE");
    bytes32 public constant WATCHER_ROLE = keccak256("WATCHER_ROLE");

    // Structs
    struct SLO {
        uint8 k; // minimum successful responses required
        uint8 n; // total vantage points
        uint16 timeout; // timeout in milliseconds
        uint16 window; // time window in minutes
    }

    struct CIDState {
        address publisher;
        SLO slo;
        uint256 totalStake;
        bytes32 lastPackCIDDigest;
        uint64 lastBreachAt;
        uint8 consecutiveFails;
        bool slashingEnabled;
        uint64 nonce; // anti-replay per CID
    }

    struct PackRef {
        bytes32 cidDigest;
        bytes32 packCIDDigest;
        uint64 ts; // epoch seconds
        uint8 status; // 0 OK, 1 DEGRADED, 2 BREACH
        uint64 nonce; // monotonic per CID
    }

    // Storage
    mapping(bytes32 => CIDState) public cids;

    // Events
    event CIDRegistered(bytes32 indexed cid, address indexed publisher, SLO slo, bool slashing);

    event StakeBonded(bytes32 indexed cid, address indexed staker, uint256 amount);

    event EvidenceAnchored(bytes32 indexed cid, bytes32 indexed packCID, uint8 status, uint64 nonce);

    event BreachDetected(bytes32 indexed cid, uint64 at);

    event Slashed(bytes32 indexed cid, uint256 amount, address indexed by);

    /**
     * @dev Constructor
     * @param policy Address to be granted POLICY_ROLE
     * @param watcher Address to be granted WATCHER_ROLE
     */
    constructor(address policy, address watcher) {
        require(policy != address(0), "Policy address cannot be zero");
        require(watcher != address(0), "Watcher address cannot be zero");

        // Grant roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(POLICY_ROLE, policy);
        _grantRole(WATCHER_ROLE, watcher);
    }

    /**
     * @dev Register a new CID for monitoring
     * @param cid The CID digest (bytes32)
     * @param slo Service Level Objective parameters
     * @param slashingEnabled Whether slashing is enabled for this CID
     */
    function registerCID(bytes32 cid, SLO calldata slo, bool slashingEnabled) external whenNotPaused {
        // Validations
        require(slo.k > 0, "k must be greater than 0");
        require(slo.k <= slo.n, "k cannot be greater than n");
        require(slo.n <= 5, "n cannot be greater than 5"); // reasonable limit for demo
        require(cids[cid].publisher == address(0), "CID already registered");

        // Set CID state
        cids[cid] = CIDState({
            publisher: msg.sender,
            slo: slo,
            totalStake: 0,
            lastPackCIDDigest: bytes32(0),
            lastBreachAt: 0,
            consecutiveFails: 0,
            slashingEnabled: slashingEnabled,
            nonce: 0
        });

        emit CIDRegistered(cid, msg.sender, slo, slashingEnabled);
    }

    /**
     * @dev Bond stake to a CID (MVP implementation)
     * @param cid The CID digest to bond stake to
     */
    function bondStake(bytes32 cid) external payable whenNotPaused nonReentrant {
        require(msg.value > 0, "Must send positive amount");
        require(cids[cid].publisher != address(0), "CID does not exist");

        cids[cid].totalStake += msg.value;

        emit StakeBonded(cid, msg.sender, msg.value);
    }

    /**
     * @dev Report evidence pack from watcher
     * @param p PackRef containing evidence information
     */
    function reportPack(PackRef calldata p) external onlyRole(WATCHER_ROLE) whenNotPaused {
        CIDState storage s = cids[p.cidDigest];

        // Validations
        require(s.publisher != address(0), "CID does not exist");
        require(p.nonce == s.nonce + 1, "Invalid nonce: must be sequential");
        require(p.ts >= s.lastBreachAt, "Timestamp cannot be before last breach");

        // Update state
        s.nonce = p.nonce;
        s.lastPackCIDDigest = p.packCIDDigest;

        // Handle status
        if (p.status == 2) {
            // BREACH
            s.consecutiveFails++;
            s.lastBreachAt = uint64(block.timestamp);
            emit BreachDetected(p.cidDigest, uint64(block.timestamp));
        } else if (p.status == 0) {
            // OK
            s.consecutiveFails = 0;
        }

        emit EvidenceAnchored(p.cidDigest, p.packCIDDigest, p.status, p.nonce);
    }

    /**
     * @dev Slash stake for SLO violations
     * @param cid The CID digest to slash
     * @param amount Amount to slash
     */
    function slash(bytes32 cid, uint256 amount) external onlyRole(POLICY_ROLE) whenNotPaused nonReentrant {
        CIDState storage s = cids[cid];

        // Validations
        require(s.slashingEnabled, "Slashing not enabled for this CID");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= s.totalStake, "Amount exceeds total stake");

        // Update stake
        s.totalStake -= amount;

        // Transfer slashed amount to publisher (MVP implementation)
        (bool success, ) = s.publisher.call{ value: amount }("");
        require(success, "Transfer failed");

        emit Slashed(cid, amount, msg.sender);
    }

    /**
     * @dev Pause the contract (emergency function)
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Get CID state information
     * @param cid The CID digest to query
     * @return slo The SLO parameters
     * @return totalStake The total staked amount
     * @return lastPackCID The last pack CID digest
     */
    function getCID(bytes32 cid) external view returns (SLO memory slo, uint256 totalStake, bytes32 lastPackCID) {
        CIDState storage s = cids[cid];
        return (s.slo, s.totalStake, s.lastPackCIDDigest);
    }

    /**
     * @dev Get full CID state
     * @param cid The CID digest to query
     * @return The complete CIDState struct
     */
    function getCIDState(bytes32 cid) external view returns (CIDState memory) {
        return cids[cid];
    }
}

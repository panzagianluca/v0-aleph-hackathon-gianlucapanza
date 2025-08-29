# CID Sentinel - Smart Contracts

## Overview

The CID Sentinel contracts provide a comprehensive solution for monitoring CID availability on IPFS with Service Level Objectives (SLO) enforcement and economic guarantees through staking and slashing mechanisms.

## Contracts

### EvidenceRegistry.sol

The main contract that implements:
- CID registration with SLO parameters
- Stake bonding and slashing
- Evidence pack reporting
- Access control with roles

## Key Features

- **SLO-based Monitoring**: Define availability requirements with k/n threshold, timeout, and time windows
- **Economic Security**: Stake bonding and slashing for SLO violations
- **Evidence Anchoring**: On-chain evidence packs linking to IPFS
- **Role-based Access**: Policy, Watcher, and Admin roles
- **Pausable Operations**: Emergency pause functionality
- **Reentrancy Protection**: Secure against reentrancy attacks

## Gas Usage (Key Functions)

Based on the latest gas snapshot:

- `registerCID`: ~100,656 gas
- `bondStake`: ~131,014 gas  
- `reportPack`: ~162,667 gas (OK status), ~163,461 gas (BREACH status)
- `slash`: ~148,483 gas

## Data Structures

### SLO (Service Level Objective)
```solidity
struct SLO {
    uint8 k;        // minimum successful responses required
    uint8 n;        // total vantage points
    uint16 timeout; // timeout in milliseconds
    uint16 window;  // time window in minutes
}
```

### CIDState
```solidity
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
```

### PackRef (Evidence Pack Reference)
```solidity
struct PackRef {
    bytes32 cidDigest;
    bytes32 packCIDDigest;
    uint64 ts;       // epoch seconds
    uint8 status;    // 0 OK, 1 DEGRADED, 2 BREACH
    uint64 nonce;    // monotonic per CID
}
```

## Events

The contract emits the following events for integration with frontend and indexing:

- `CIDRegistered(bytes32 indexed cid, address indexed publisher, SLO slo, bool slashing)`
- `StakeBonded(bytes32 indexed cid, address indexed staker, uint256 amount)`
- `EvidenceAnchored(bytes32 indexed cid, bytes32 indexed packCID, uint8 status, uint64 nonce)`
- `BreachDetected(bytes32 indexed cid, uint64 at)`
- `Slashed(bytes32 indexed cid, uint256 amount, address indexed by)`

## Roles

- **DEFAULT_ADMIN_ROLE**: Can pause/unpause and manage roles
- **POLICY_ROLE**: Can execute slashing operations
- **WATCHER_ROLE**: Can report evidence packs

## Frontend Integration

### ABI Location
The ABI is available at: `../apps/web/src/abi/EvidenceRegistry.json`

### Key Functions for Frontend

1. **Register CID**:
   ```typescript
   await contract.registerCID(cidDigest, slo, slashingEnabled)
   ```

2. **Bond Stake**:
   ```typescript
   await contract.bondStake(cidDigest, { value: amount })
   ```

3. **Get CID State**:
   ```typescript
   const state = await contract.getCIDState(cidDigest)
   ```

### Event Topics for viem Integration

```typescript
// Event signatures for filtering
const eventTopics = {
  CIDRegistered: '0x...', // keccak256("CIDRegistered(bytes32,address,tuple,bool)")
  StakeBonded: '0x...', // keccak256("StakeBonded(bytes32,address,uint256)")
  EvidenceAnchored: '0x...', // keccak256("EvidenceAnchored(bytes32,bytes32,uint8,uint64)")
  BreachDetected: '0x...', // keccak256("BreachDetected(bytes32,uint64)")
  Slashed: '0x...', // keccak256("Slashed(bytes32,uint256,address)")
}
```

## Development

### Prerequisites
- Foundry installed (`foundryup`)
- Node.js and npm for dev dependencies

### Setup
```bash
# Install dependencies
forge install
npm install

# Compile contracts
forge build

# Run tests
forge test

# Run fuzz tests
forge test --fuzz-runs 256

# Generate gas snapshot
forge snapshot

# Format code
npx prettier --write 'src/**/*.sol'

# Lint code
npx solhint 'src/**/*.sol'
```

### Testing

The contract includes comprehensive test suites:

- **Unit Tests**: 32 tests covering all functions and edge cases
- **Fuzz Tests**: 6 property-based tests for invariants and security
- **Integration Tests**: End-to-end workflow testing

All tests pass successfully:
```
Ran 42 tests: 42 passed, 0 failed
```

### Security Features

1. **Reentrancy Guard**: All payable functions protected
2. **Access Control**: Role-based permissions
3. **Input Validation**: Comprehensive parameter checking
4. **Pausable**: Emergency stop mechanism
5. **Monotonic Nonce**: Prevents replay attacks
6. **Timestamp Validation**: Prevents time manipulation

### Deployment

The contract constructor requires:
```solidity
constructor(address policy, address watcher)
```

Deploy with appropriate policy and watcher addresses for your environment.

## License

MIT License - see LICENSE file for details.

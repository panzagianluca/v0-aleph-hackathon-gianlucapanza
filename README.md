# CID Sentinel

A decentralized content integrity dashboard built for Aleph Hackathon 2025.

## Overview

CID Sentinel provides a comprehensive solution for tracking and verifying content integrity using Content Identifiers (CIDs), Service Level Objectives (SLOs), and Ed25519 cryptographic signatures.

## Architecture

### Monorepo Structure

\`\`\`
cid-sentinel/
├── apps/
│   ├── web/          # Next.js 14 dashboard (port 3000)
│   └── api/          # Next.js API for cron jobs (port 3001)
├── packages/
│   └── core/         # Shared types, utils, and crypto
├── contracts/        # Foundry smart contracts
└── scripts/          # Build and deployment scripts
\`\`\`

### Tech Stack

- **Frontend**: Next.js 14 App Router, Tailwind CSS, shadcn/ui
- **Blockchain**: Wagmi, Viem, Foundry
- **Crypto**: Ed25519 signatures via @noble/ed25519
- **Build Tools**: Turbo, pnpm workspaces
- **Smart Contracts**: Solidity 0.8.19, Foundry

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Foundry

### Installation

\`\`\`bash
# Clone and install dependencies
git clone <repo-url>
cd cid-sentinel
pnpm install

# Install Foundry dependencies
cd contracts
forge install
cd ..
\`\`\`

### Development

\`\`\`bash
# Start all applications
pnpm dev

# Or start individually
pnpm --filter @cid-sentinel/web dev    # Web dashboard on :3000
pnpm --filter @cid-sentinel/api dev    # API server on :3001

# Smart contract development
cd contracts
forge build
forge test
\`\`\`

### Testing

\`\`\`bash
# Run all tests
pnpm test

# Smart contract tests
cd contracts
forge test -vvv
\`\`\`

## Features

### Core Functionality

- **Package Verification**: Track and verify content integrity using CIDs
- **SLO Monitoring**: Define and monitor Service Level Objectives
- **Cryptographic Signing**: Ed25519 signatures for authenticity
- **Smart Contract Integration**: On-chain verification and storage
- **Real-time Dashboard**: Live metrics and package status

### Smart Contracts

- `CIDSentinel.sol`: Main contract for package verification and SLO management
- Authorized verifier system
- Event-driven architecture for transparency
- Gas-optimized operations

### API Endpoints

- Package verification endpoints
- SLO management
- Cron job handlers for automated tasks
- Integration with smart contracts

## Development Workflow

1. **Setup**: Use `pnpm dev` to start all services
2. **Frontend**: Develop in `apps/web/` with hot reload
3. **API**: Build endpoints in `apps/api/app/api/`
4. **Contracts**: Test and deploy from `contracts/`
5. **Shared Code**: Add types and utils to `packages/core/`

## Deployment

\`\`\`bash
# Build all packages
pnpm build

# Deploy smart contracts
cd contracts
forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast

# Deploy applications (configure your deployment platform)
pnpm deploy
\`\`\`

## Environment Variables

\`\`\`bash
# Smart contract deployment
RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key

# API configuration
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_auth_secret
\`\`\`

## Contributing

This project was built for Aleph Hackathon 2025. Contributions welcome!

## License

MIT License - see LICENSE file for details.

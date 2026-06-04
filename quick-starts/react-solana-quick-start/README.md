# MetaMask Embedded Wallets — React Solana Quick Start

React + Vite boilerplate for **MetaMask Embedded Wallets (Web3Auth)** + **[Solana Kit](https://www.solanakit.com/docs/getting-started)**.

## What each SDK does

| Feature | Web3Auth (`@web3auth/modal/react/solana`) | Solana Kit (`src/solana/`) |
|--------|-------------------------------------------|----------------------------|
| Login / logout | `useWeb3AuthConnect`, `useWeb3AuthDisconnect` | — |
| Wallet address | `useSolanaWallet` → `accounts` | — |
| Read chain / RPC | `useSolanaWallet` → `rpc` | — |
| Sign message | `useSignMessage` | — |
| Sign transaction | `useSignTransaction` | `buildSolTransferTransaction` |
| Send transaction | `useSignAndSendTransaction` | `buildSolTransferTransaction` |
| Switch chain | `useSwitchChain` + `useWeb3Auth` | — |
| Solana React context | `SolanaProvider` (wraps app) | — |

Kit is only used to **build** transfer transactions and format lamports. Signing and RPC endpoints are handled by Web3Auth.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io) — add Solana chain(s) under **Chains & Networks** (RPC URLs come from the dashboard; this app does not hardcode them)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/quick-starts/react-solana-quick-start
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your Client ID:

```
VITE_WEB3AUTH_CLIENT_ID=YOUR_CLIENT_ID
```

### 4. Run the application

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

> Use **Sapphire Devnet** (the default) for local development. Sapphire Mainnet does not allow localhost.

## Project layout

```
src/
  solana/transfer.ts   # Kit: build a SOL transfer transaction
  components/          # Web3Auth Solana hooks (one component per action)
  web3authContext.tsx
  main.tsx             # Web3AuthProvider + SolanaProvider
```

## Resources

- [Build with AI](https://docs.metamask.io/embedded-wallets/build-with-ai/) — set up the MCP server and skill for AI-assisted integration
- [Dashboard — Chains and Networks](https://docs.metamask.io/embedded-wallets/dashboard/chains-and-networks/)
- [Solana Kit — Getting started](https://www.solanakit.com/docs/getting-started)
- [Solana Kit — Sending transactions](https://www.solanakit.com/docs/guides/sending-transactions)
- [MetaMask Embedded Wallets — Solana](https://docs.metamask.io/embedded-wallets/connect-blockchain/solana/)
- [React SDK](https://docs.metamask.io/embedded-wallets/sdk/react/)
- [Dashboard](https://dashboard.web3auth.io)

## License

MIT

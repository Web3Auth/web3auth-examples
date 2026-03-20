# MetaMask Embedded Wallets — StarkNet

React + Vite example using MetaMask Embedded Wallets (powered by Web3Auth) on **StarkNet** (Ethereum L2). After social login, the app derives an ed25519 key and uses the StarkNet provider to deploy a wallet, sign transactions, and interact with Cairo contracts.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)
- StarkNet JSON-RPC endpoints (Mainnet and/or Sepolia) — a public Sepolia endpoint is pre-filled in `.env.example`

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/other/starknet-example
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_WEB3AUTH_CLIENT_ID=YOUR_CLIENT_ID
VITE_WEB3AUTH_CLIENT_ID_DEV=YOUR_DEVNET_CLIENT_ID
VITE_STARKNET_JSON_RPC_URL_MAINNET=YOUR_MAINNET_RPC_URL
VITE_STARKNET_JSON_RPC_URL_SEPOLIA=https://starknet-sepolia.public.blastapi.io/rpc/v0_8
```

### 4. Run the application

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

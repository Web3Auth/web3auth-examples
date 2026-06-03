# MetaMask Embedded Wallets — StarkNet

React + Vite example using MetaMask Embedded Wallets (powered by Web3Auth) on **StarkNet** (Ethereum L2). After social login, the app grinds Web3Auth's secp256k1 key to a Stark-curve key and uses the StarkNet provider to deploy a wallet, sign transactions, and interact with Cairo contracts.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)

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
```

> During local development, the app uses a hardcoded Devnet Client ID in `web3authContext.tsx`. For production builds, set `VITE_WEB3AUTH_CLIENT_ID`. StarkNet RPC URLs are configured in `App.tsx`, not via environment variables.

### 4. Run the application

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [Build with AI](https://docs.metamask.io/embedded-wallets/build-with-ai/) — set up the MCP server and skill for AI-assisted integration
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

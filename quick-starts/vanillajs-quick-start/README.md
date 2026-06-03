# MetaMask Embedded Wallets — Vanilla JS Quick Start

Plain JavaScript (Vite) example using MetaMask Embedded Wallets (powered by Web3Auth) on EVM chains. No framework — just `@web3auth/modal` instantiated directly. Use this as a reference for integrations in environments without a framework (or as the foundation for any bundler-based setup).

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/quick-starts/vanillajs-quick-start
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

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [Build with AI](https://docs.metamask.io/embedded-wallets/build-with-ai/) — set up the MCP server and skill for AI-assisted integration
- [JavaScript SDK](https://docs.metamask.io/embedded-wallets/sdk/js/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

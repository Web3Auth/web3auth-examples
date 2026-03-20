# MetaMask Embedded Wallets — React Quick Start

Minimal React + Vite example demonstrating MetaMask Embedded Wallets (powered by Web3Auth) with the pre-built modal UI on EVM chains. Uses the `@web3auth/modal` React SDK with built-in hooks and native Wagmi integration.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/quick-starts/react-quick-start
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
- [React SDK](https://docs.metamask.io/embedded-wallets/sdk/react/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

# MetaMask Embedded Wallets — React Playground

A comprehensive React demo showcasing the full capabilities of MetaMask Embedded Wallets (powered by Web3Auth): multiple social login methods, chain switching, transaction signing, user info retrieval, MFA, and more. Use this as a reference implementation before building your own integration.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/react-playground
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

## What this playground covers

- Social logins (Google, Facebook, Discord, and more)
- External wallet connections (MetaMask Extension, WalletConnect)
- EVM transaction signing and message signing
- User info and wallet address display
- Chain switching across EVM networks
- MFA setup flow

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [React SDK](https://docs.metamask.io/embedded-wallets/sdk/react/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

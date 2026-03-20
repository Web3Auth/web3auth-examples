# MetaMask Embedded Wallets — Vue Quick Start

Vue 3 example using MetaMask Embedded Wallets (powered by Web3Auth) on EVM chains. Uses the `@web3auth/modal` Vue SDK with native composables and built-in Wagmi Vue integration — the only embedded wallet SDK with first-class Vue support.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/quick-starts/vue-quick-start
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
VUE_APP_WEB3AUTH_CLIENT_ID=YOUR_CLIENT_ID
```

### 4. Run the application

```bash
npm run serve
```

Visit `http://localhost:8080` in your browser.

> Use **Sapphire Devnet** (the default) for local development. Sapphire Mainnet does not allow localhost.

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [Vue SDK](https://docs.metamask.io/embedded-wallets/sdk/vue/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

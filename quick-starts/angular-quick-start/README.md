# MetaMask Embedded Wallets — Angular Quick Start

Angular example using MetaMask Embedded Wallets (powered by Web3Auth) on EVM chains. Uses the `@web3auth/modal` JavaScript SDK directly (no framework wrapper), which works with Angular, Svelte, and any other web framework.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/quick-starts/angular-quick-start
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set your Client ID

Open `src/app/app.component.ts` and replace the placeholder `clientId` value with your own Client ID from the [Dashboard](https://dashboard.web3auth.io).

### 4. Run the application

```bash
npm start
```

Visit `http://localhost:4200` in your browser.

> Use **Sapphire Devnet** (the default) for local development. Sapphire Mainnet does not allow localhost.

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [JavaScript SDK](https://docs.metamask.io/embedded-wallets/sdk/js/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

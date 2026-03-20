# MetaMask Embedded Wallets — Smart Account (Account Abstraction)

React + Vite example using MetaMask Embedded Wallets (powered by Web3Auth) as the **signer for an ERC-4337 smart account**. The Web3Auth wallet acts as the owner key for a smart contract account (e.g. Safe), enabling gasless transactions, batched calls, and paymasters.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/other/smart-account-example
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
```

### 4. Run the application

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [Smart Accounts](https://docs.metamask.io/embedded-wallets/features/smart-accounts/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

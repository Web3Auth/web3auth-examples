# MetaMask Embedded Wallets — XMTP

React + Vite example using MetaMask Embedded Wallets (powered by Web3Auth) as the wallet identity for **XMTP decentralised messaging**. Users authenticate with social login and use their derived wallet to send and receive encrypted messages on the XMTP network.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/other/xmtp-example
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

Optional — the app reads `process.env.REACT_APP_XMTP_ENV` for the XMTP network (defaults to `production` if unset). In a Vite project, `.env` variables require a `VITE_` prefix to be exposed; this example relies on the default unless you configure env passthrough.

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

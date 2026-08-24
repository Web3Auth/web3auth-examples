# MetaMask Embedded Wallets — Server-Side Verification

Next.js example demonstrating how to **verify a Web3Auth `id_token` on the backend**. After the user connects their wallet on the frontend, the app sends the token to a Next.js API route that validates it using the Web3Auth JWKS endpoint — proving the user owns the wallet address without any custodial trust.

## Prerequisites

- Node.js 22.12+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/other/server-side-verification-example
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=YOUR_CLIENT_ID
```

### 4. Run the application

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [Build with AI](https://docs.metamask.io/embedded-wallets/build-with-ai/) — set up the MCP server and skill for AI-assisted integration
- [Server-Side Verification](https://docs.metamask.io/embedded-wallets/features/server-side-verification/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

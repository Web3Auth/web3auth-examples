# MetaMask Embedded Wallets — Auth0 (Implicit)

React + Vite example using MetaMask Embedded Wallets (powered by Web3Auth) with an **Auth0 connection** via the implicit / OIDC flow. Auth0 handles authentication; Web3Auth derives the wallet from the resulting ID token.

## Prerequisites

- Node.js 22.12+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)
- An Auth0 application and a custom Auth0 connection configured on the Dashboard ([Auth0 guide](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/auth0/))

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/custom-authentication/single-connection/auth0-implicit-example
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
- [Build with AI](https://docs.metamask.io/embedded-wallets/build-with-ai/) — set up the MCP server and skill for AI-assisted integration
- [Auth0 Integration Guide](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/auth0/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

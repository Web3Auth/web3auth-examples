# MetaMask Embedded Wallets — Custom JWT

React + Vite example using MetaMask Embedded Wallets (powered by Web3Auth) with a **bring-your-own JWT** backend. You issue the JWT from your own server; Web3Auth validates it via your JWKS endpoint and derives the user's wallet. Compatible with any OAuth 2.0 / OIDC-compliant identity provider.

> The JWT must include an `iat` claim within 60 seconds of the current time on every login attempt, regardless of `exp`.

## Prerequisites

- Node.js 22.12+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)
- Your own JWT issuer with a publicly accessible JWKS endpoint
- A custom JWT connection configured on the Dashboard ([Custom JWT guide](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/custom-jwt/))

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/custom-authentication/single-connection/custom-jwt-example
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the JWT issuer (required)

In a separate terminal, start the demo JWT server:

```bash
cd server
npm install
npm start
```

The server runs at `http://localhost:8080` by default and exposes `/api/token`.

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_WEB3AUTH_CLIENT_ID=YOUR_CLIENT_ID
```

Optional — override the JWT server URL (defaults to `http://localhost:8080`):

```
VITE_JWT_SERVER_URL=http://localhost:8080
```

### 5. Run the application

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [Build with AI](https://docs.metamask.io/embedded-wallets/build-with-ai/) — set up the MCP server and skill for AI-assisted integration
- [Custom JWT Guide](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/custom-jwt/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

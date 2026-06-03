# MetaMask Embedded Wallets — Auth0 + Google Grouped Connection (JWT)

React + Vite example using MetaMask Embedded Wallets (powered by Web3Auth) with a **grouped connection** that combines Auth0 (GitHub via JWT) and Google OAuth (JWT flow). A grouped connection ensures the same user always gets the **same wallet address** regardless of which provider they use to sign in.

> Without grouping, signing in with Google and signing in with Auth0 would produce two completely different wallet addresses for the same person.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)
- An Auth0 application — get your Auth0 Client ID and domain ([Auth0 guide](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/auth0/))
- A Google OAuth app — get your Google Client ID from the [Google Cloud Console](https://console.cloud.google.com/)
- A grouped connection on the Dashboard combining Auth0 and Google ([Grouped Connections guide](https://docs.metamask.io/embedded-wallets/authentication/group-connections/))

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/custom-authentication/grouped-connection/auth0-google-jwt-grouped-example
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
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
VITE_AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
VITE_AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
```

### 4. Run the application

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [Build with AI](https://docs.metamask.io/embedded-wallets/build-with-ai/) — set up the MCP server and skill for AI-assisted integration
- [Grouped Connections Guide](https://docs.metamask.io/embedded-wallets/authentication/group-connections/)
- [Auth0 Integration Guide](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/auth0/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

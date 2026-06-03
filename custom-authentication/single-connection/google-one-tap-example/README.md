# MetaMask Embedded Wallets — Google One Tap

React + Vite example using MetaMask Embedded Wallets (powered by Web3Auth) with **Google One Tap** sign-in. Users authenticate with the minimal One Tap overlay (no full OAuth redirect) and receive a non-custodial wallet.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)
- A Google OAuth app with One Tap enabled — get your Google Client ID from the [Google Cloud Console](https://console.cloud.google.com/)
- A custom Google connection configured on the Dashboard ([guide](https://docs.metamask.io/embedded-wallets/authentication/social-logins/google/))

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/custom-authentication/single-connection/google-one-tap-example
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
```

### 4. Run the application

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [Build with AI](https://docs.metamask.io/embedded-wallets/build-with-ai/) — set up the MCP server and skill for AI-assisted integration
- [Google Login Setup](https://docs.metamask.io/embedded-wallets/authentication/social-logins/google/)
- [Authentication Overview](https://docs.metamask.io/embedded-wallets/authentication/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

# MetaMask Embedded Wallets — Firebase (JWT)

React + Vite example using MetaMask Embedded Wallets (powered by Web3Auth) with a **Firebase authentication connection** via the JWT flow. Firebase issues the ID token; Web3Auth validates it against the Firebase JWKS endpoint and derives the user's wallet.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)
- A Firebase project with Authentication enabled
- A custom Firebase connection configured on the Dashboard ([Firebase guide](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/firebase/))

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/custom-authentication/single-connection/firebase-jwt-example
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
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
```

### 4. Run the application

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [Build with AI](https://docs.metamask.io/embedded-wallets/build-with-ai/) — set up the MCP server and skill for AI-assisted integration
- [Firebase Integration Guide](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/firebase/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

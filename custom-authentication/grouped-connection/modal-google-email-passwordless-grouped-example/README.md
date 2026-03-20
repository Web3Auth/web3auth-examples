# MetaMask Embedded Wallets — Google + Email Passwordless Grouped Connection (Modal)

React + Vite example using MetaMask Embedded Wallets (powered by Web3Auth) with a **grouped connection** that combines Google OAuth and email passwordless login, both surfaced through the built-in modal UI. A grouped connection ensures the same user always gets the **same wallet address** regardless of whether they sign in with Google or their email.

> Without grouping, a user who signs in with Google and later with email passwordless would end up with two separate wallets.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)
- A grouped connection on the Dashboard combining Google and email passwordless ([Grouped Connections guide](https://docs.metamask.io/embedded-wallets/authentication/group-connections/))

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/custom-authentication/grouped-connection/modal-google-email-passwordless-grouped-example
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
- [Grouped Connections Guide](https://docs.metamask.io/embedded-wallets/authentication/group-connections/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

# MetaMask Embedded Wallets — Examples

[MetaMask Embedded Wallets](https://docs.metamask.io/embedded-wallets/) (powered by Web3Auth) provides non-custodial social login wallets using threshold key cryptography. Users authenticate with OAuth or custom JWT providers and receive a deterministic, self-custodied wallet — no seed phrase required.

This repository contains ready-to-run examples across frameworks, blockchains, and authentication providers.

## Prerequisites

- Node.js 22+
- npm
- A Client ID from the [Dashboard](https://dashboard.web3auth.io)

> Use **Sapphire Devnet** for local development (allows localhost). Switch to **Sapphire Mainnet** only when deploying to production.

## Quick Setup

```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
cd web3auth-examples/<example-directory>
cp .env.example .env          # add your Client ID
npm install
npm start                     # or npm run dev / npm run serve
```

---

## Example Directory

### Quick Starts

The fastest way to get a working integration for your framework.

| Framework | Example | Chain | SDK Doc |
|-----------|---------|-------|---------|
| **React** | [react-quick-start](quick-starts/react-quick-start) | EVM | [React SDK](https://docs.metamask.io/embedded-wallets/sdk/react/) |
| **React (No-Modal)** | [react-no-modal-quick-start](quick-starts/react-no-modal-quick-start) | EVM | [React SDK](https://docs.metamask.io/embedded-wallets/sdk/react/) |
| **React + Solana** | [react-solana-quick-start](quick-starts/react-solana-quick-start) | Solana | [React SDK](https://docs.metamask.io/embedded-wallets/sdk/react/) |
| **Next.js** | [nextjs-quick-start](quick-starts/nextjs-quick-start) | EVM | [React SDK](https://docs.metamask.io/embedded-wallets/sdk/react/) |
| **Vue.js** | [vue-quick-start](quick-starts/vue-quick-start) | EVM | [Vue SDK](https://docs.metamask.io/embedded-wallets/sdk/vue/) |
| **Vue.js + Solana** | [vue-solana-quick-start](quick-starts/vue-solana-quick-start) | Solana | [Vue SDK](https://docs.metamask.io/embedded-wallets/sdk/vue/) |
| **Angular** | [angular-quick-start](quick-starts/angular-quick-start) | EVM | [JavaScript SDK](https://docs.metamask.io/embedded-wallets/sdk/js/) |
| **Vanilla JS** | [vanillajs-quick-start](quick-starts/vanillajs-quick-start) | EVM | [JavaScript SDK](https://docs.metamask.io/embedded-wallets/sdk/js/) |

---

### Custom Authentication — Single Connection

Each example wires one external identity provider to a dedicated Web3Auth connection. Set up your connection on the [Dashboard](https://dashboard.web3auth.io) before running.

| Provider | Example | Auth Flow | Dashboard Guide |
|----------|---------|-----------|-----------------|
| Google (OAuth) | [google-implicit-example](custom-authentication/single-connection/google-implicit-example) | Implicit | [Google](https://docs.metamask.io/embedded-wallets/authentication/social-logins/google/) |
| Google One Tap | [google-one-tap-example](custom-authentication/single-connection/google-one-tap-example) | Implicit | [Google](https://docs.metamask.io/embedded-wallets/authentication/social-logins/google/) |
| Facebook | [facebook-implicit-example](custom-authentication/single-connection/facebook-implicit-example) | Implicit | [Authentication](https://docs.metamask.io/embedded-wallets/authentication/) |
| Discord | [discord-implicit-example](custom-authentication/single-connection/discord-implicit-example) | Implicit | [Authentication](https://docs.metamask.io/embedded-wallets/authentication/) |
| Twitch | [twitch-implicit-example](custom-authentication/single-connection/twitch-implicit-example) | Implicit | [Authentication](https://docs.metamask.io/embedded-wallets/authentication/) |
| Worldcoin | [worldcoin-implicit-example](custom-authentication/single-connection/worldcoin-implicit-example) | Implicit | [Authentication](https://docs.metamask.io/embedded-wallets/authentication/) |
| Auth0 (Implicit) | [auth0-implicit-example](custom-authentication/single-connection/auth0-implicit-example) | Implicit | [Auth0](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/auth0/) |
| Auth0 (JWT) | [auth0-jwt-example](custom-authentication/single-connection/auth0-jwt-example) | JWT | [Auth0](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/auth0/) |
| AWS Cognito | [cognito-implicit-example](custom-authentication/single-connection/cognito-implicit-example) | Implicit | [Cognito](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/aws-cognito/) |
| Firebase | [firebase-jwt-example](custom-authentication/single-connection/firebase-jwt-example) | JWT | [Firebase](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/firebase/) |
| Custom JWT | [custom-jwt-example](custom-authentication/single-connection/custom-jwt-example) | JWT | [Custom JWT](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/custom-jwt/) |
| Modal (default) | [modal-example](custom-authentication/single-connection/modal-example) | Modal | [Dashboard](https://docs.metamask.io/embedded-wallets/dashboard/) |

---

### Custom Authentication — Grouped Connections

Grouped connections let multiple login methods resolve to the **same wallet address** for a user. Essential for apps that offer both social login and email passwordless login.

| Providers | Example | Guide |
|-----------|---------|-------|
| Auth0 + Google (Implicit) | [auth0-google-implicit-grouped-example](custom-authentication/grouped-connection/auth0-google-implicit-grouped-example) | [Grouped Connections](https://docs.metamask.io/embedded-wallets/authentication/group-connections/) |
| Auth0 + Google (JWT) | [auth0-google-jwt-grouped-example](custom-authentication/grouped-connection/auth0-google-jwt-grouped-example) | [Grouped Connections](https://docs.metamask.io/embedded-wallets/authentication/group-connections/) |
| Firebase + Google (JWT) | [firebase-google-jwt-grouped-example](custom-authentication/grouped-connection/firebase-google-jwt-grouped-example) | [Grouped Connections](https://docs.metamask.io/embedded-wallets/authentication/group-connections/) |
| Google + Email Passwordless (Modal) | [modal-google-email-passwordless-grouped-example](custom-authentication/grouped-connection/modal-google-email-passwordless-grouped-example) | [Grouped Connections](https://docs.metamask.io/embedded-wallets/authentication/group-connections/) |

---

### Other — Chains & Advanced Features

| Example | Description | Docs |
|---------|-------------|------|
| [algorand-example](other/algorand-example) | Sign transactions on Algorand | — |
| [aptos-example](other/aptos-example) | Interact with the Aptos Move blockchain | — |
| [bitcoin-example](other/bitcoin-example) | Sign Bitcoin transactions | — |
| [cosmos-example](other/cosmos-example) | Interact with Cosmos SDK chains | — |
| [multi-chain-example](other/multi-chain-example) | Operate Ethereum, Solana, Tezos, and Polkadot in one session | — |
| [polkadot-example](other/polkadot-example) | Sign transactions on Polkadot/Substrate | — |
| [polymesh-example](other/polymesh-example) | Interact with the Polymesh security token network | — |
| [starknet-example](other/starknet-example) | Interact with StarkNet (Ethereum L2) | — |
| [sui-example](other/sui-example) | Sign transactions on Sui | — |
| [tezos-example](other/tezos-example) | Sign transactions on Tezos | — |
| [ton-example](other/ton-example) | Interact with TON (Telegram Open Network) | — |
| [tron-example](other/tron-example) | Sign transactions on TRON | — |
| [xrpl-example](other/xrpl-example) | Interact with the XRP Ledger | — |
| [smart-account-example](other/smart-account-example) | Send EVM transactions via Wagmi with Web3Auth as the signer | [Smart Accounts](https://docs.metamask.io/embedded-wallets/features/smart-accounts/) |
| [server-side-verification-example](other/server-side-verification-example) | Verify a Web3Auth `id_token` on your Next.js backend | [Server-Side Verification](https://docs.metamask.io/embedded-wallets/features/server-side-verification/) |
| [solana-pay-example](other/solana-pay-example) | Solana Pay QR-code payment requests with Web3Auth | [Solana](https://docs.metamask.io/embedded-wallets/connect-blockchain/solana/) |
| [sns-example](other/sns-example) | Solana Name Service (SNS) resolution | [Solana](https://docs.metamask.io/embedded-wallets/connect-blockchain/solana/) |
| [sign-protocol-example](other/sign-protocol-example) | On-chain attestations on Sepolia via Sign Protocol | — |
| [xmtp-example](other/xmtp-example) | Decentralised messaging with XMTP | — |

---

## Build with AI

Speed up integrations by giving your AI coding assistant access to the documentation and SDK reference.

**Skill** (guides SDK selection, auth concepts, and common pitfalls):

```bash
npx skills add web3auth/skill
```

**MCP server** (live docs, examples, and SDK types). Add to Cursor or Claude Code:

```json
{
  "mcpServers": {
    "web3auth": {
      "url": "https://mcp.web3auth.io"
    }
  }
}
```

**Static docs** (for tools without MCP support):

- Full snapshot: `https://docs.metamask.io/llms-embedded-wallets-full.txt`
- Index: `https://docs.metamask.io/llms-embedded-wallets.txt`

See the full [Build with AI](https://docs.metamask.io/embedded-wallets/build-with-ai/) guide for per-agent setup.

---

## Resources

- [MetaMask Embedded Wallets Documentation](https://docs.metamask.io/embedded-wallets/)
- [Build with AI](https://docs.metamask.io/embedded-wallets/build-with-ai/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community — Builder Hub](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT

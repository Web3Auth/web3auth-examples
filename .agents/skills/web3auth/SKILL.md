---
name: web3auth
description: Integrates MetaMask Embedded Wallets (Web3Auth) for non-custodial wallets via social login or custom JWT (Firebase, Auth0, Cognito). Use when integrating @web3auth/modal (React, Vue, Next.js, Vite, Angular), @web3auth/react-native-sdk (Expo/bare RN—Custom Dev Client, not Expo Go), web3auth_flutter, native Android/iOS, Unity, or @web3auth/node-sdk. Invoke for Sapphire devnet/mainnet, dashboard client ID, grouped connections (same address across Google + email passwordless), implicit vs JWT auth flows, useWeb3AuthConnect, id_token server-side verification, or SDK migration (web v11, RN v9, OPENLOGIN_NETWORK/LOGIN_PROVIDER legacy). Also use when users get different wallet addresses per login method or need RN Metro setup/withWeb3Auth migration. Do NOT use for MetaMask browser extension only, RainbowKit/ConnectKit without embedded wallets, or unrelated smart-contract work.
---

# MetaMask Embedded Wallets (Web3Auth)

Before writing code, use MCP tools for live docs and examples. Do not guess package names, API signatures, or config.

Dashboard: https://developer.metamask.io  
Docs: https://docs.metamask.io/embedded-wallets/  
Community: https://builder.metamask.io/c/embedded-wallets/5

## MCP tools (use in order)

Examples and SDK source are **live-discovered** from GitHub. [references/examples.md](references/examples.md) has filter recipes only. Always call `get_example` before codegen. MCP live at https://mcp.web3auth.io

1. **`search_docs`** — Search docs (Algolia) and example projects.
   - `query` (required)
   - `platform?`: `react` | `vue` | `js` | `react-native` | `android` | `ios` | `flutter` | `unity` | `unreal` | `node`
   - `chain?`: `evm` | `solana` | `other`
   - `category?`: `quick-start` | `custom-auth` | `blockchain` | `feature` | `playground`
2. **`get_doc`** — Full doc page by URL (`docs.metamask.io`). Read platform SDK doc before codegen.
3. **`get_example`** — Complete example source from GitHub (primary integration reference).
   - `name?`, `platform?`, `chain?`, `category?`, `auth_method?` (e.g. `firebase`, `auth0`, `grouped`)
   - Always fetch quick-start before a new integration; fetch auth-specific example for custom auth.
   - Check for filter recipes and eval anchor names[references/examples.md](references/examples.md)
4. **`search_community`** — Builder Hub. `query?` or `topic_id?` for full thread.
5. **`get_sdk_reference`** — SDK source for **debugging types/signatures only** (not feature discovery).
   - `platform` (required), `module?` (omit first to list modules), `focus?`: `types` | `hooks` | `main-class` | `errors` | `all` (default `types`)

**MCP unavailable:** `https://docs.metamask.io/llms-embedded-wallets-full.txt` (full), `https://docs.metamask.io/llms-embedded-wallets.txt` (index).

## Prerequisite - Dashboard Setup flow

1. Create project at developer.metamask.io → Client ID.
2. Sapphire Devnet (local) or Mainnet (production).
3. Allowlist domains (web) or bundle IDs + deep link schemes (mobile).
4. Configure chains on Dashboard (web/Node) or in code (RN, Android, iOS, Flutter, Unity, Unreal).
5. Authentication: default socials or custom connections.
6. Optional: session duration, test accounts, key export, whitelabel. 

Read https://docs.metamask.io/embedded-wallets/dashboard/

## Key derivation rules (CRITICAL)

Same wallet address requires **all** of:

- Same Client ID
- Same Sapphire network (devnet **or** mainnet — never mix)
- Same connection configuration (same auth connection ID)
- Same `useSFAKey` boolean in integrations.

Change any → different address forever.

- **Never** change Client ID or Sapphire network in production.
- Sapphire is not blockchain devnet/mainnet. Devnet allows localhost; Mainnet does not.
- Local dev & staging: Sapphire Devnet. Production: Sapphire Mainnet only. Do not use Devnet in production.
- Avoid putting random flags like `useSFAKey` / `useCoreKitKey` — unless user already has it or wants to use wallet pregeneration. Wallet pregeneration only works with `useSFAKey` / `useCoreKitKey` as true.

## SDK selection

| Choose | When |
|--------|------|
| **React** (`@web3auth/modal/react`) | React, Next.js — Hooks |
| **Vue** (`@web3auth/modal/vue`) | Vue, Nuxt — Composables |
| **JavaScript** (`@web3auth/modal`) | Angular, Svelte, Vanilla JS |
| **React Native** (`@web3auth/react-native-sdk`) | Expo or Bare RN - Hooks |
| **Android / iOS / Flutter** | Native mobile SDKs — export key + platform lib (no built-in provider) |
| **Unity / Unreal** | Game SDKs — export key + platform lib (no built-in provider) |
| **Node.js** (`@web3auth/node-sdk`) | Backend, AI agents — custom JWT only, stateless |

Per-platform details and quirks: [references/platforms.md](references/platforms.md)

## Scenarios

Fetch / tripwire / verify workflows by task: [references/scenarios.md](references/scenarios.md)

## Examples catalog [MOST IMPORTANT]

Examples are live on GitHub; call `get_example` or `search_docs` before writing integration code. MCP filter recipes and eval anchor names: [references/examples.md](references/examples.md)

## Authentication

Connections, implicit vs JWT flows, grouped connections, JWT `iat` rule: [references/authentication.md](references/authentication.md)

## Migration

Upgrading existing integrations — version table, workflow, legacy PnP/CoreKit/SFA: [references/migration.md](references/migration.md)

**Summary:** One guide per platform to current major (Web v11, RN v9, Android v9, iOS v10, Flutter v6). Use each guide's AI-assisted prompt. Never change Client ID or Sapphire network unless intentional.

- Migration index: https://docs.metamask.io/embedded-wallets/migration-guides/
# Platform Quick Reference

Authoritative capability matrix for Embedded Wallets SDKs. Read the section for the user's platform **before** generating integration code.

## React / Next.js / Vite (@web3auth/modal v11)

- Provider-based architecture. All hooks inside provider tree.
- Node.js 22+ for `@web3auth/modal@11`.
- Next.js App Router: provider in `"use client"` component. Never put provider in a Next.js server component.
- Modal (pre-built UI) via `connect()`. Modal UI can be customised on dashboard, supports only implicit logins.
- No Modal (create your own UI buttons) via `connectTo()`. Works best for custom authentication flows.
- **EVM hooks:** Wagmi v3 from `@web3auth/modal/react/wagmi` — not generic Wagmi alone.
- **Solana hooks:** from `@web3auth/modal/react/solana` - works with @solana/kit
- `connection.ethereumProvider` is for edge cases only (private/ public key export, or custom JSON-RPC not added in dashboard). Useful for non EVM flows.

## Vue / Nuxt (@web3auth/modal v11)

- Composables in `setup()` or `<script setup>`.
- Node.js 22+ for `@web3auth/modal@11`.
- Modal (pre-built UI) via `connect()`. Modal UI can be customised on dashboard, supports only implicit logins.
- No Modal (create your own UI buttons) via `connectTo()`. Works best for custom authentication flows.
- **EVM composables:** Wagmi v3 from `@web3auth/modal/vue/wagmi` — not generic Wagmi alone.
- **Solana composables:** from `@web3auth/modal/react/solana` - works with @solana/kit
- `connection.ethereumProvider` is for edge cases only (private/ public key export, or custom JSON-RPC not added in dashboard). Useful for non EVM flows.

## JavaScript (Angular / Svelte / Vanilla)

- Direct `Web3Auth` class; `init()` in constructor
- Node.js 22+ for `@web3auth/modal@11`.
- Modal (pre-built UI) via `connect()`. Modal UI can be customised on dashboard, supports only implicit logins.
- No Modal (create your own UI buttons) via `connectTo()`. Works best for custom authentication flows.
- `connection.ethereumProvider` is for edge cases only (private/ public key export, or custom JSON-RPC not added in dashboard). Useful for non EVM flows.

## React Native (Bare / Expo)

- Built-in EVM and Solana providers which can work with ethers and @solana/web3.js respectively.
- Allowlist bundle ID (iOS) and package name (Android). Deep link scheme must match app config and Dashboard allowlist (`Info.plist`, `AndroidManifest.xml`).
- **Expo Go does not work** — Custom Dev Client or EAS build.
- Metro polyfills differ from web — read RN Metro troubleshooting + `get_example` for RN.
- Hooks is the preferred flow. Imperative `new Web3Auth(...)` works but hooks are preferred.

## Android (Kotlin)

- Deep link in `AndroidManifest.xml`; allowlist package name.
- No built-in providers. After login: `web3Auth.getPrivKey()` → web3j or similar.
- Dashboard chain config **not** supported — RPC URLs in code.

## iOS (Swift)

- Allowlist bundle identifier.
- URL scheme in `Info.plist`; `onOpenURL` for OAuth callback.
- No built-in providers. After login: `web3Auth.getPrivKey()` → web3swift or similar.
- Dashboard chain config **not** supported — RPC URLs in code.

## Flutter (Dart)

- Deep links on iOS + Android; allowlist both identifiers.
- No built-in providers. After login: `web3auth.getPrivKey()` → web3dart.
- Dashboard chain config **not** supported — RPC URLs in code.

## Unity (C#)

- Deep link + allowlist bundle ID and scheme.
- No built-in providers. Export private key after login; use some Unity EVM library.
- Dashboard chain config **not** supported — RPC URLs in code.

## Unreal Engine (C++/Blueprints)

- SDK under **MetaMask** org on GitHub (not Web3Auth).
- Deep link + allowlist bundle ID and scheme.
- No built-in providers. Export private key after login; use some Unreal-compatible library.
- Dashboard chain config **not** supported — RPC URLs in code.

## Node.js (@web3auth/node-sdk)

- Server-side only. Custom auth only (JWT mandatory). Stateless per-request key derivation.
- Built-in EVM and Solana providers. Dashboard chain config supported.
- Separate Dashboard project recommended — avoid mixing server and client keys.
- Best for: AI agents, backend custody, automated transactions.
- No MFA, Wallet UI, Funding, or WalletConnect UI (backend integration).

## Private key export

- Dashboard toggle (Key Export Settings).
- Web, React Native, Node: can sign without exporting when export disabled.
- Android, iOS, Flutter, Unity, Unreal: export is the only way to use blockchains (no built-in providers); export toggle behavior differs on these platforms.

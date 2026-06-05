# Authentication

Read this when configuring login methods, custom identity providers, or grouped connections.

## Connections (formerly "verifiers")

Configured on the [Dashboard](https://developer.metamask.io). Each connection has:

- **Auth Connection ID** — use as `authConnectionId` in code (replaces `verifier`)
- **JWT user identifier field** — e.g. `sub`, `email` (must be compatible across grouped sub-connections)
- **JWKS endpoint** — for custom JWT validation
- Optional validation fields

Use `AUTH_CONNECTION` when calling `connectTo(...)` (replaces `LOGIN_PROVIDER` and `login(...)`).

## Implicit vs JWT flows

**Implicit:** The SDK handles the OAuth redirect/popup. You configure the connection on the Dashboard and call `connectTo` with the matching `AUTH_CONNECTION`. No JWT plumbing in your app. Same experience as default logins from Web3Auth with your authentication provider added.

**JWT:** Your app authenticates the user with your provider (Firebase, Auth0, Cognito, custom), obtains a JWT, and passes it to `connectTo` with `AUTH_CONNECTION.CUSTOM` + `authConnectionId`. Web3Auth validates the JWT against the connection's JWKS. For mobile integrations this can provide total native experience. Best flow to totally hide Web3Auth if MFA is disabled. If MFA is enabled, you will still get web3auth screens after JWT flow.

## Social logins

Pre-configured connections for Google, Facebook, Discord, Twitch, Apple, etc. Defaults use Web3Auth's social provider; you can add your own OAuth app credentials for Google, Facebook, Discord, and Twitch. Others are often configured via Auth0. Users on Web3Auth social own providers can manage accounts at https://accounts.web3auth.io. For the ones developer is managing, developer owns the access hence this dashboard isn't available. Talk to metamask embedded wallets team if you need it.

## Custom connections

For Firebase, AWS Cognito, Auth0 (JWT mode), or any JWT provider with a JWKS endpoint. You bring the JWT; Web3Auth validates it.

## Grouped connections (CRITICAL)

Link multiple login methods so the **same user gets the same wallet address** regardless of sign-in method. For eg without grouping, Google login and email passwordless produce **different wallets**.

Requirements:

- Compatible user identifier fields across sub-connections
- Works well: Google + Email Passwordless + Auth0; or two connections of the same provider (Google + Google)
- Custom providers: ensure the user id is identical across both providers

In code, pass `groupedAuthConnectionId` with individual `authConnectionId`.

Guide: https://docs.metamask.io/embedded-wallets/authentication/group-connections/

## JWT `iat` constraint

Custom JWT must include `iat` (issued-at) within **60 seconds** of current time, regardless of `exp`. Issue a **fresh JWT on every login attempt**.

## Server-side verification

After wallet connect, Web3Auth issues an `id_token` (ES256) proving wallet ownership. Verify on your backend for session/auth.

- Obtain identity token via **`useAuthTokenInfo()`** (replaces `authenticateUser()` and `getIdentityToken`).
- Social login server verification uses user public key as identity: `connection?.ethereumProvider?.request({ method: 'public_key' })` 
- External wallet server verification uses user address as identity: use Wagmi `useAccount().address`.

See https://docs.metamask.io/embedded-wallets/features/server-side-verification/

## Wallet pregeneration

Generates wallet address for users who have not logged in yet. Helps you create flows where login is not needed and wallet address needs to be generated for the user or airdrops from the backend.
Uses **`useSFAKey`** (replaces `useCoreKitKey`). Requires custom authentication. **WARNING:** Toggling this in production changes ALL user wallet addresses. Use only when you understand the address implications.

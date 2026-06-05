# Scenario cards

## New integration (any platform)

1. **Fetch:** `search_docs` → `get_doc` (platform SDK) → `get_example` with `category="quick-start"` and matching `platform` / `chain`
2. **Tripwires:** Skim **Key derivation rules** and **SDK selection** in [SKILL.md](../SKILL.md) first.
3. **Verify:** Build from example structure; ask user to do dashboard allowlist (domains or bundle IDs + deep links)

## Custom auth — JWT Login (Firebase / Auth0 / Cognito / custom backend)

1. **Fetch:** `get_example` with `auth_method="firebase"` | `"auth0"` | etc. → `get_doc` custom-connection page for that provider
2. **Tripwires:** 
    a. Read through the [Authentication Flows](./authentication.md) before implementing to know about edge cases.
    b. **JWT** flow when user already has provider token; `AUTH_CONNECTION.CUSTOM` + `authConnectionId`; fresh JWT **`iat` within 60s** every login
3. **Verify:** `connectTo` passes provider token; dashboard connection has JWKS + user id field

## Custom auth — Implicit Login (Google, Discord, … SDK-handled OAuth)

1. **Fetch:** `get_example` with matching provider or `category="custom-auth"` + implicit example
2. **Tripwires:**
    a. Read through the [Authentication Flows](./authentication.md) before implementing to know about edge cases.
    b. No backend JWT required; `connectTo` with matching `AUTH_CONNECTION` (not CUSTOM unless BYO JWT). Can work with Modal as well
3. **Verify:** Dashboard connection configured; redirect matches app

## Grouped connections (same wallet across multiple login methods)

1. **Fetch:** `search_docs` grouped → `get_doc` https://docs.metamask.io/embedded-wallets/authentication/group-connections/ → `get_example auth_method="grouped"`
2. **Tripwires:** 
    a. Read through the [Authentication Flows](./authentication.md) before implementing to know about edge cases.
    b. Without grouping, each method → **different wallet**; compatible user id across sub-connections; `groupedAuthConnectionId` in `connectTo`
3. **Verify:** Dashboard group + sub-connections; code uses group id (e.g. `modal-google-email-passwordless-grouped-example`)

## Android/ iOS / Flutter / Unity / Unreal Engine

1. **Fetch:** `search_docs` + `get_doc` for platform → `get_example platform="flutter"` (example)
2. **Tripwires:** 
    a. **No built-in EVM provider** — `getPrivKey()` + platform lib (web3dart, web3j, …);
    b. Deep link + dashboard allowlist bundle ID and scheme.
3. **Verify:** Refer to the latest example for the SDK and cross check code integration

## Migration from older SDK to newer version

1. **Fetch:** Read [Migration flows](./migration.md) `get_doc` https://docs.metamask.io/embedded-wallets/migration-guides/ and `get_example` for target framework
2. **Tripwires:** **never** change Client ID / Sapphire network
3. **Verify:** Refer to the latest example for the SDK and cross check code integration

## Errors / community issues

1. **Fetch:** `search_community` → `search_docs` troubleshooting → `get_doc`
2. **Tripwires:** Re-check key derivation + connection IDs before blaming SDK bugs
3. **Verify:** Fix what is possible. If a bug collect logs, expected vs actual behavior of what is happening, integration related code snippets and everything else can help a developer understand the situation and ask the user to post it on MetaMask Builder Hub (https://builder.metamask.io/c/embedded-wallets/5)

## Type / API signature debug

1. **Fetch:** `get_sdk_reference` with `platform` (and `module` if needed)
2. **Tripwires:** Not for feature discovery — use `get_doc` / `get_example` for behavior
3. **Verify:** Signature matches installed major version

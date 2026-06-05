# Migrating an Existing Integration

Read this when the user is upgrading an older Web3Auth / MetaMask Embedded Wallets SDK, or migrating from PnP, Core Kit, SFA, or Torus.

**Do not hand-roll upgrades.** Each platform has one official migration guide that jumps from any older version to the current major in a single pass. Each guide includes an **AI-assisted migration** prompt — use it verbatim in planning mode, review the plan before generating code.

**NEVER change Client ID or Sapphire network during migration** — it changes every user's wallet address forever. Preserve clientId, RPC URLs, redirect schemes, and whitelabel settings.

Index: https://docs.metamask.io/embedded-wallets/migration-guides/

Install skill + MCP before migrating: `npx skills add web3auth/skill` and MCP at `https://mcp.web3auth.io`. See https://docs.metamask.io/embedded-wallets/build-with-ai/

## Migration workflow

1. **Detect current version** — Read `package.json`, `Podfile`/SPM, `build.gradle`, or `pubspec.yaml`. Scan for legacy signals:
   - `Web3AuthNoModal`
   - `OPENLOGIN_NETWORK`
   - `privateKeyProvider`
   - `useCoreKitKey`
   - Manual polyfill / `globals.js`
   - SFA

2. **Open the platform migration guide** — Use `get_doc` or fetch the URL. One guide covers all older versions → current major.

3. **Use the guide's AI-assisted prompt** — Copy verbatim; use planning mode; review before code generation.

4. **Mirror official examples, not SDK READMEs** — Trust `get_example` and the migration guide.

5. **Preserve identity config** — Same Client ID, same Sapphire network (devnet vs mainnet), same connection IDs.

6. **Stay in scope** — Do not touch lockfiles, CI, or unrelated code. Propose install/uninstall commands; do not run git or installs without user approval.

7. **Report at the end** — Files changed/created/deleted, exact package commands, manual Dashboard steps (Allowed Origins, redirect `://auth`, bundle IDs).

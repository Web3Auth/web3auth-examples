# Official Examples — MCP routing

**Do not codegen from this file.** Examples are live on GitHub; call `get_example` or `search_docs` before writing integration code. Paths drift — filters are stable.

## Repos (one per platform family)

| Platform | Repo |
|----------|------|
| Web (React, Vue, JS) | [web3auth-examples](https://github.com/Web3Auth/web3auth-examples) |
| React Native | [web3auth-react-native-examples](https://github.com/Web3Auth/web3auth-react-native-examples) |
| Android | [web3auth-android-examples](https://github.com/Web3Auth/web3auth-android-examples) |
| iOS | [web3auth-ios-examples](https://github.com/Web3Auth/web3auth-ios-examples) |
| Flutter | [web3auth-flutter-examples](https://github.com/Web3Auth/web3auth-flutter-examples) |
| Unity | [web3auth-unity-examples](https://github.com/Web3Auth/web3auth-unity-examples) |
| Unreal | [web3auth-unreal-example](https://github.com/MetaMask/web3auth-unreal-example) (MetaMask org) |
| Node.js | [web3auth-node-examples](https://github.com/Web3Auth/web3auth-node-examples) |

If `get_example` returns no match, use `name=` with anchor folder below or open the repo URL directly.

## Filter recipes

### Web [web3auth-examples](https://github.com/Web3Auth/web3auth-examples)

`cp .env.example .env` → Client ID → `npm install` → `npm start` / `npm run dev`

| Scenario | MCP call |
|----------|----------|
| New React app | `get_example platform="react" category="quick-start"` |
| New Next.js | `get_example platform="react" category="quick-start"` + search `nextjs` or `name="Next.js"` |
| New Vue / Solana web | `get_example platform="vue" category="quick-start"` or `chain="solana"` |
| Angular / vanilla | `get_example platform="js" category="quick-start"` |
| Firebase JWT | `get_example auth_method="firebase"` → **`firebase-jwt-example`** |
| Auth0 JWT / implicit | `get_example auth_method="auth0"` |
| Custom JWT | `get_example category="custom-auth"` + `auth_method` or `name="custom jwt"` |
| Grouped connections | `get_example auth_method="grouped"` → **`modal-google-email-passwordless-grouped-example`** |
| Auth0 + Google grouped | `get_example auth_method="grouped"` + search `auth0-google` |
| Server-side verification | `get_example category="feature"` + search `server-side` |
| Smart accounts | `search_docs smart account` + `get_example` |
| Non-EVM chain (Aptos, Sui, …) | `get_example chain="other"` or `search_docs` + chain name |

### React Native [web3auth-react-native-examples](https://github.com/Web3Auth/web3auth-react-native-examples)

Clone example subfolder → `cp .env.example .env` → Client ID → `npm install` → deep links + Dashboard allowlist (bundle ID / package name) → Custom Dev Client or EAS build (Expo Go does not work)

**Layout:** Quick start / Expo — single `App.tsx`. Auth/feature — `App.tsx` + `components/LoginView.tsx` + `HomeView.tsx`; shared `web3authConfig.ts` and `lib/evm.ts` or `lib/solana.ts`. v9 hooks (`Web3AuthProvider`, `useWeb3AuthConnect`).

| Scenario | MCP call |
|----------|----------|
| New integration (bare) | `get_example platform="react-native" category="quick-start"` → **`rn-bare-quick-start`** |
| Expo | `get_example platform="react-native"` + `name="expo"` → **`rn-expo-example`** |
| Firebase JWT | `get_example platform="react-native" auth_method="firebase"` → **`rn-bare-firebase-example`** |
| Auth0 | `get_example platform="react-native" auth_method="auth0"` |
| Grouped | `get_example platform="react-native" auth_method="grouped"` → **`rn-bare-aggregate-verifier-example`** |
| Solana | `get_example platform="react-native" chain="solana"` |

### Android [web3auth-android-examples](https://github.com/Web3Auth/web3auth-android-examples)

Clone example subfolder → open in Android Studio → set Client ID → `AndroidManifest.xml` deep link + Dashboard allowlist (package name)

**Layout:** Standalone app per subfolder — copy login flow + `getPrivKey()`, then wire web3j.

| Scenario | MCP call |
|----------|----------|
| New integration | `get_example platform="android" category="quick-start"` → **`android-quick-start`** |
| Firebase JWT | `get_example platform="android" auth_method="firebase"` → **`android-firebase-example`** |
| Auth0 | `get_example platform="android" auth_method="auth0"` → **`android-auth0-example`** |
| Grouped | `get_example platform="android" auth_method="grouped"` → **`android-aggregate-verifier-example`** |
| Solana | `get_example platform="android" chain="solana"` → **`android-solana-example`** |


### iOS [web3auth-ios-examples](https://github.com/Web3Auth/web3auth-ios-examples)

Clone example subfolder → open in Xcode → set Client ID → `Info.plist` URL scheme + `onOpenURL` + Dashboard allowlist (bundle ID)

**Layout:** Standalone app per subfolder — copy login flow + `getPrivKey()`, then wire web3swift.

| Scenario | MCP call |
|----------|----------|
| New integration | `get_example platform="ios" category="quick-start"` → **`ios-quick-start`** |
| Firebase JWT | `get_example platform="ios" auth_method="firebase"` → **`ios-firebase-example`** |
| Auth0 | `get_example platform="ios" auth_method="auth0"` → **`ios-auth0-example`** |
| Grouped | `get_example platform="ios" auth_method="grouped"` → **`ios-aggregate-verifier-example`** |
| Solana | `get_example platform="ios" chain="solana"` → **`ios-solana-example`** |
| Aptos | `name="ios-aptos-example"` or `get_example platform="ios" chain="other"` |


### Flutter [web3auth-flutter-examples](https://github.com/Web3Auth/web3auth-flutter-examples)

Clone example subfolder → `flutter pub get` → set Client ID → deep links (iOS + Android) + Dashboard allowlist (bundle ID / package name) → `flutter run`

**Layout:** Standalone app per subfolder — copy login flow + `getPrivKey()`, then wire web3dart.

| Scenario | MCP call |
|----------|----------|
| New integration | `get_example platform="flutter" category="quick-start"` → **`flutter-quick-start`** |
| Firebase JWT | `get_example platform="flutter" auth_method="firebase"` → **`flutter-firebase-example`** |
| Auth0 | `get_example platform="flutter" auth_method="auth0"` → **`flutter-auth0-example`** |
| Grouped | `get_example platform="flutter" auth_method="grouped"` → **`flutter-aggregate-verifier-example`** |
| Solana | `get_example platform="flutter" chain="solana"` → **`flutter-solana-example`** |


### Unity [web3auth-unity-examples](https://github.com/Web3Auth/web3auth-unity-examples)

Clone example subfolder → open in Unity Editor → set Client ID → deep link + Dashboard allowlist (bundle ID / URL scheme)

**Layout:** C# scripts under `Assets/` — copy login flow + exported key, then wire Unity EVM lib.


| Scenario | MCP call |
|----------|----------|
| New integration | `get_example platform="unity" category="quick-start"` → **`unity-quick-start`** |
| Auth0 | `get_example platform="unity" auth_method="auth0"` → **`unity-auth0-example`** |
| Grouped | `get_example platform="unity" auth_method="grouped"` → **`unity-aggregate-verifier-example`** |


### Unreal [web3auth-unreal-example](https://github.com/MetaMask/web3auth-unreal-example) — MetaMask org

**Layout:** C++ SDK, mobile-focused — copy login flow + exported key from plugin sources under `Plugins/Web3AuthSDK/`.

Clone repo → open `unrealexample.uproject` in Unreal → set Client ID → deep link + Dashboard allowlist — plugin at `Plugins/Web3AuthSDK/`

| Scenario | MCP call |
|----------|----------|
| New integration | `get_example platform="unreal" category="quick-start"` — single repo root (no subfolders) |


### Node [web3auth-node-examples](https://github.com/Web3Auth/web3auth-node-examples)

`cp .env.example .env` → Client ID → `npm install` → `npm start` / `npm run dev`

**Layout:** Stateless per-request JWT → derived key. Use a separate Dashboard project from client apps.

| Scenario | MCP call |
|----------|----------|
| EVM (custom JWT) | `get_example platform="node" category="quick-start"` → **`evm-quick-start`** |
| Firebase JWT | `get_example platform="node" auth_method="firebase"` → **`firebase-quick-start`** |
| Solana | `get_example platform="node" chain="solana"` → **`solana-quick-start`** |

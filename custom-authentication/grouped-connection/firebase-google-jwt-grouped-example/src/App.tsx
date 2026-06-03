import "./App.css";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react";
import { WALLET_CONNECTORS, AUTH_CONNECTION } from "@web3auth/modal";
import { initializeApp } from "firebase/app";
import { GithubAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { SendTransaction } from "./components/sendTransaction";
import { Balance } from "./components/getBalance";
import { SwitchChain } from "./components/switchNetwork";
import { SignMessage } from "./components/signMessage";
import { useConnection } from "wagmi";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
// Firebase configuration — values come from .env (see .env.example)
// Firebase browser API keys are intentionally public identifiers; security is enforced via Firebase Auth rules
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function App() {
  const { connectTo, isConnected, connectorName } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { address } = useConnection();

  const loginWithGoogle = async (response: CredentialResponse) => {
    const idToken = response.credential;

    await connectTo(WALLET_CONNECTORS.AUTH, {
      groupedAuthConnectionId: "aggregate-sapphire",
      authConnectionId: "w3a-google",
      authConnection: AUTH_CONNECTION.GOOGLE,
      idToken,
      extraLoginOptions: {
        isUserIdCaseSensitive: false,
      },
    });
  };

  const loginWithFirebaseGithub = async () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const githubProvider = new GithubAuthProvider();

    const result = await signInWithPopup(auth, githubProvider);    

    const idToken = await result.user.getIdToken(true);

    connectTo(WALLET_CONNECTORS.AUTH, {
      groupedAuthConnectionId: "aggregate-sapphire",
      authConnectionId: "w3a-firebase",
      authConnection: AUTH_CONNECTION.CUSTOM,
      idToken,
      extraLoginOptions: {
        isUserIdCaseSensitive: false,
      },
    });
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <h2>Connected to {connectorName}</h2>
      <div>{address}</div>
      <div className="flex-container">
        <div>
          <button onClick={() => uiConsole(userInfo)} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={() => disconnect()} className="card">
            Log Out
          </button>
        </div>
      </div>
      <SendTransaction />
      <Balance />
      <SwitchChain />
      <SignMessage />
    </>
  );

  const unloggedInView = (
    <div className="flex-container">
      <div className="card">
        <GoogleLogin
          onSuccess={loginWithGoogle}
          onError={() => {
            console.log("Login Failed");
          }}
          shape="pill"
          theme="filled_blue"
          text="signin_with"
          size="large"
          logo_alignment="center"
        />
      </div>
      <button onClick={loginWithFirebaseGithub} className="card">
        Login with Firebase GitHub
      </button>
    </div>
  );

  return (
    <div className="w3a-example container">
      <h1 className="title">
        <a target="_blank" href="https://docs.metamask.io/embedded-wallets/sdk/react/" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & React No Modal with Firebase & Google Grouped Connection JWT
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-examples/tree/main/custom-authentication/grouped-connection/firebase-google-jwt-grouped-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;

/* eslint-disable no-console */
import "./App.css";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser, useManageMFA, useEnableMFA } from "@web3auth/modal/react";
import { WALLET_CONNECTORS, AUTH_CONNECTION } from "@web3auth/modal";
import { useConnection } from "wagmi";
import { SendTransaction } from "./components/sendTransaction";
import { Balance } from "./components/getBalance";
import { SwitchChain } from "./components/switchNetwork";
import { SignMessage } from "./components/signMessage";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
  const { connectTo, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { address } = useConnection();
  const { manageMFA, loading: manageMFALoading, error: manageMFAError } = useManageMFA();
  const { enableMFA, loading: enableMFALoading, error: enableMFAError } = useEnableMFA();

  const loginWithFirebaseGoogle = async () => {
    try {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, googleProvider);    

      const idToken = await result.user.getIdToken(true);

      connectTo(WALLET_CONNECTORS.AUTH, {
        authConnectionId: "web3auth-firebase-examples",
        authConnection: AUTH_CONNECTION.CUSTOM,
        idToken,
        extraLoginOptions: {
          isUserIdCaseSensitive: true,
        },
      });
    } catch (error) {
      console.error("Firebase authentication error:", error);
    }
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <div className="grid">
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
          {disconnectLoading && <div className="loading">Disconnecting...</div>}
          {disconnectError && <div className="error">{disconnectError.message}</div>}
        </div>
        <div>
          <button onClick={() => enableMFA()} className="card">
            Enable MFA
          </button>
          {enableMFALoading && <div className="loading">Enabling MFA...</div>}
          {enableMFAError && <div className="error">{enableMFAError.message}</div>}
        </div>
        <div>
          <button onClick={() => manageMFA()} className="card">
            Manage MFA
          </button>
          {manageMFALoading && <div className="loading">Managing MFA...</div>}
          {manageMFAError && <div className="error">{manageMFAError.message}</div>}
        </div>
      </div>
      <SendTransaction />
      <Balance />
      <SwitchChain />
      <SignMessage />
    </div>
  );

  const unloggedInView = (
    <div className="grid">
      <div className="flex-container">
        <button onClick={loginWithFirebaseGoogle} className="card">
          Login with Firebase Google
        </button>
      </div>
      {connectLoading && <div className="loading">Connecting...</div>}
      {connectError && <div className="error">{connectError.message}</div>}
    </div>
  );

  return (
    <div className="w3a-example container">
      <h1 className="title">
        <a target="_blank" href="https://docs.metamask.io/embedded-wallets/sdk/react/" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & React No Modal with Firebase
      </h1>

      {isConnected ? loggedInView : unloggedInView}
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-examples/tree/main/custom-authentication/single-connection/firebase-jwt-example"
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

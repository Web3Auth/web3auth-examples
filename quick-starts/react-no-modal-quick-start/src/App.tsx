import "./App.css";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react";
// IMP START - Blockchain Calls  
import { useAccount } from "wagmi";
import { SendTransaction } from "./components/sendTransaction";
import { Balance } from "./components/getBalance";
import { SwitchChain } from "./components/switchNetwork";
import { AUTH_CONNECTION, WALLET_CONNECTORS } from "@web3auth/modal";
// IMP END - Blockchain Calls
import { useState } from "react";
function App() {
  const [email, setEmail] = useState("");
  // IMP START - Login  
  const { connectTo, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  // IMP END - Login
  // IMP START - Logout
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  // IMP END - Logout
  const { userInfo } = useWeb3AuthUser();
  // IMP START - Blockchain Calls
  const { address } = useAccount();
  // IMP END - Blockchain Calls

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
      {/* // IMP START - Blockchain Calls */}
      <div>{address}</div>
      {/* // IMP END - Blockchain Calls */}
      <div className="flex-container">
        <div>
          <button onClick={() => uiConsole(userInfo)} className="card">
            Get User Info
          </button>
        </div>
        {/* // IMP START - Logout */}
        <div>
          <button onClick={() => disconnect()} className="card">
            Log Out
          </button>
          {disconnectLoading && <div className="loading">Disconnecting...</div>}
          {disconnectError && <div className="error">{disconnectError.message}</div>}
        </div>
        {/* // IMP END - Logout */}
      </div>
      {/* IMP START - Blockchain Calls */}
      <SendTransaction />
      <Balance />
      <SwitchChain />
      {/* IMP END - Blockchain Calls */}
    </div>
  );

  const unloggedInView = (
    // IMP START - Login  
    <div className="grid">
      <button onClick={() => connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.GOOGLE,
      })} className="card">
        Login via Google
      </button>
      <button onClick={() => connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.FACEBOOK,
      })} className="card">
        Login via Facebook
      </button>
      <button onClick={() => connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.TWITTER,
      })} className="card">
        Login via X
      </button>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={() => connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.EMAIL_PASSWORDLESS,
        loginHint: email,
      })} className="card">
        Login via Email Passwordless
      </button>
      {connectLoading && <div className="loading">Connecting...</div>}
      {connectError && <div className="error">{connectError.message}</div>}
    </div>
    // IMP END - Login

  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & React No Modal Quick Start
      </h1>

      {isConnected ? loggedInView : unloggedInView}
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-examples/tree/main/quick-starts/react-quick-start"
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


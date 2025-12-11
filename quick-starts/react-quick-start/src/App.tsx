import "./App.css";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react";
// IMP START - Blockchain Calls  
import { useAccount } from "wagmi";
import { SendTransaction } from "./components/sendTransaction";
import { Balance } from "./components/getBalance";
import { SwitchChain } from "./components/switchNetwork";
// IMP END - Blockchain Calls
import { useState, useRef, useEffect } from "react";

function App() {
  // IMP START - Login  
  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  // IMP END - Login
  // IMP START - Logout
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  // IMP END - Logout
  const { userInfo } = useWeb3AuthUser();
  // IMP START - Blockchain Calls
  const { address } = useAccount();
  // IMP END - Blockchain Calls

  const [showConsole, setShowConsole] = useState(false);
  const consoleContentRef = useRef<HTMLParagraphElement>(null);

  function uiConsole(...args: any[]): void {
    if (consoleContentRef.current) {
      consoleContentRef.current.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  useEffect(() => {
    if (showConsole && userInfo && consoleContentRef.current) {
      uiConsole(userInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showConsole]);

  const handleToggleConsole = () => {
    setShowConsole(!showConsole);
  };

  const loggedInView = (
    <div className="grid">
      <h2>Connected to {connectorName}</h2>
      {/* // IMP START - Blockchain Calls */}
      <div>{address}</div>
      {/* // IMP END - Blockchain Calls */}
      <div className="flex-container">
        <div>
          <button onClick={handleToggleConsole} className="card">
            {showConsole ? "Hide User Info" : "Get User Info"}
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
      {showConsole && (
        <div id="console" style={{ whiteSpace: "pre-line", textAlign: "left" }}>
          <p ref={consoleContentRef} style={{ whiteSpace: "pre-line", margin: 0 }}></p>
        </div>
      )}
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
      <button onClick={() => connect()} className="card">
        Login
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
        & React Modal Quick Start
      </h1>

      {isConnected ? loggedInView : unloggedInView}

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

import "./App.css";
import { useEffect, useState } from "react";
import {
  useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser, useWeb3Auth
} from "@web3auth/modal/react";
import { getTronAccount, getTronBalance, signMessage, signAndSendTransaction } from "./tronRPC";

function App() {
  const { connect, isConnected, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { connection } = useWeb3Auth();
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  useEffect(() => {
    if (!connection?.ethereumProvider) return;
    (connection.ethereumProvider.request({ method: "private_key" }) as Promise<string>)
      .then((k) => setPrivateKey(k ?? null))
      .catch(console.error);
  }, [connection]);

  const onGetPrivateKey = async () => {
    uiConsole("Private Key:", privateKey);
  };

  const onGetTronAccount = async () => {
    if (!privateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const address = await getTronAccount(privateKey);
    uiConsole("Tron Address:", address);
  };

  const onGetTronBalance = async () => {
    if (!privateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const balance = await getTronBalance(privateKey);
    uiConsole("Tron Balance:", balance);
  };

  const onSignMessage = async () => {
    if (!privateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const result = await signMessage(privateKey);
    uiConsole("Signature:", result);
  };

  const onSignAndSendTransaction = async () => {
    if (!privateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const result = await signAndSendTransaction(privateKey);
    uiConsole("Transaction Result:", result);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <div className="grid">
      <div className="flex-container">
        <div>
          <button onClick={() => uiConsole(userInfo)} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={onGetPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button onClick={onGetTronAccount} className="card">
            Get Tron Account
          </button>
        </div>
        <div>
          <button onClick={onGetTronBalance} className="card">
            Get Tron Balance
          </button>
        </div>
        <div>
          <button onClick={onSignMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={onSignAndSendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={() => disconnect()} className="card">
            Log Out
          </button>
          {disconnectLoading && <div className="loading">Disconnecting...</div>}
          {disconnectError && <div className="error">{disconnectError.message}</div>}
        </div>
      </div>
    </div>
  );

  const unloggedInView = (
    <div className="grid">
      <button onClick={() => connect()} className="card">
        Login
      </button>
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
        & Tron Example
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-examples/tree/main/other/tron-example"
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


import "./App.css";
import { useEffect, useState } from "react";
import {
  useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser, useWeb3Auth
} from "@web3auth/modal/react";
import { getAlgorandKeyPair, getAccounts, getBalance, signMessage, signAndSendTransaction } from "./algorandRPC";



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

  const onGetAlgorandKeypair = async () => {
    if (!privateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const algorandKeypair = await getAlgorandKeyPair(privateKey);
    uiConsole("Keypair", algorandKeypair);
  };

  const onGetAccounts = async () => {
    if (!privateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const userAccount = await getAccounts(privateKey);
    uiConsole("Address", userAccount);
  };

  const onGetBalance = async () => {
    if (!privateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const balance = await getBalance(privateKey);
    uiConsole("Balance", balance, "You can get testnet funds from https://bank.testnet.algorand.network/");
  };

  const onSignMessage = async () => {
    if (!privateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const result = await signMessage(privateKey);
    uiConsole("Hash", result);
  };

  const onSignAndSendTransaction = async () => {
    if (!privateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const result = await signAndSendTransaction(privateKey);
    uiConsole("Transaction ID: ", result);
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
          <button onClick={onGetAlgorandKeypair} className="card">
            Get Algorand Keypair
          </button>
        </div>
        <div>
          <button onClick={onGetAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={onGetBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={onSignAndSendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={onSignMessage} className="card">
            Sign Message
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
    <div className="w3a-example container">
      <h1 className="title">
        <a target="_blank" href="https://docs.metamask.io/embedded-wallets/sdk/react/" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & Algorand Example
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-examples/tree/main/other/algorand-example"
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

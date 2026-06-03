import "./App.css";
import { useEffect, useState } from "react";
import {
  useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser, useWeb3Auth
} from "@web3auth/modal/react";
import { getAccounts, getBalance, getAirdrop, sendTransaction } from "./aptosRPC";

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
    uiConsole("Private Key", privateKey);
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
    const address = await getAccounts(privateKey);
    const balance = await getBalance(address);
    uiConsole("Balance", balance);
  };

  const onGetAirdrop = async () => {
    if (!privateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const address = await getAccounts(privateKey);
    const result = await getAirdrop(address, 1000000000000000);
    uiConsole("Airdropped some tokens TxID: ", result.hash);
  };

  const onSendTransaction = async () => {
    if (!privateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const result = await sendTransaction(privateKey);
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
      <h2>A new account is not formed until it has some funds within it. Get airdropped some tokens to start with.</h2>
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
          <button onClick={onGetAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={onGetAirdrop} className="card">
            Get Airdrop
          </button>
        </div>
        <div>
          <button onClick={onGetBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={onSendTransaction} className="card">
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
        & Aptos Example
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-examples/tree/main/other/aptos-example"
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

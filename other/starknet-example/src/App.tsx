import {
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/modal/react";
import "./App.css";
import { useEffect, useState } from "react";
import {
  deployAccount,
  getAccounts,
  getBalance,
  getPrivateKey,
} from "./starknetRPC";
import { RpcProvider } from "starknet";

const isProduction = process.env.NODE_ENV === "production";

function App() {
  const starknetProvider = new RpcProvider({
    nodeUrl: isProduction
      ? "https://starknet-mainnet.public.blastapi.io/rpc/v0_8"
      : "https://starknet-sepolia.public.blastapi.io/rpc/v0_8",
  });

  const { connection } = useWeb3Auth();
  const { userInfo } = useWeb3AuthUser();
  const [rawPrivateKey, setRawPrivateKey] = useState<string | null>(null);

  useEffect(() => {
    if (!connection?.ethereumProvider) return;
    (connection.ethereumProvider.request({ method: "private_key" }) as Promise<string>)
      .then((k) => setRawPrivateKey(k ?? null))
      .catch(console.error);
  }, [connection]);

  const {
    connect,
    isConnected,
    loading: connectLoading,
    error: connectError,
  } = useWeb3AuthConnect();

  const {
    disconnect,
    loading: disconnectLoading,
    error: disconnectError,
  } = useWeb3AuthDisconnect();

  const onGetPrivateKey = async () => {
    if (!rawPrivateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const starknetKey = getPrivateKey(rawPrivateKey);
    uiConsole("Private Key (grinded for Starknet)", starknetKey);
  };

  const onGetAccounts = async () => {
    if (!rawPrivateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const userAccount = await getAccounts(rawPrivateKey);
    uiConsole("Address", userAccount);
  };

  const onDeployAccount = async () => {
    if (!rawPrivateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const userAccount = await deployAccount({
      privateKey: rawPrivateKey,
      starknetProvider: starknetProvider,
    });
    uiConsole("Address", userAccount);
  };

  const onGetBalance = async () => {
    if (!rawPrivateKey) {
      uiConsole("Not connected yet");
      return;
    }
    const balance = await getBalance({
      privateKey: rawPrivateKey,
      starknetProvider: starknetProvider,
    });
    uiConsole("Balance", balance);
  };

  const loggedInView = (
    <div className="grid">
      <div className="funding-notice">
        <p>
          Note: Before deploying your StarkNet account, you need to fund your
          address
        </p>
      </div>

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
          <button onClick={onDeployAccount} className="card">
            Deploy Account
          </button>
        </div>
        <div>
          <button onClick={onGetBalance} className="card">
            Get Balance (STRK)
          </button>
        </div>
        <div>
          <button onClick={() => disconnect()} className="card">
            Log Out
          </button>
          {disconnectLoading && <div className="loading">Disconnecting...</div>}
          {disconnectError && (
            <div className="error">{disconnectError.message}</div>
          )}
        </div>
      </div>
    </div>
  );

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

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
        <a
          target="_blank"
          href="https://docs.metamask.io/embedded-wallets/sdk/react/"
          rel="noreferrer"
        >
          Web3Auth{" "}
        </a>
        -{" "}
        <a
          href="https://www.starknet.io"
          target="_blank"
          rel="noreferrer"
          style={{ color: "white" }}
        >
          StarkNet
        </a>{" "}
        Example
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
      {isConnected && (
        <div id="console" style={{ whiteSpace: "pre-line" }}>
          <p style={{ whiteSpace: "pre-line" }}></p>
        </div>
      )}
      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-examples/tree/main/other/starknet-example"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "underline",
          }}
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;

import {
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/modal/react";
import "./App.css";
import {
  deployAccount,
  getAccounts,
  getBalance,
  getPrivateKey,
} from "./starknetRPC";
import { RpcProvider } from "starknet";

const isProduction = process.env.NODE_ENV === "production";

function App() {
  // StarkNet provider setup
  const starknetProvider = new RpcProvider({
    nodeUrl: isProduction
      ? "https://starknet-mainnet.public.blastapi.io/rpc/v0_8"
      : "https://starknet-sepolia.public.blastapi.io/rpc/v0_8",
  });

  const { provider: web3authProvider } = useWeb3Auth();
  const { userInfo } = useWeb3AuthUser();

  // Web3Auth hooks
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
    if (!web3authProvider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const privateKey = await getPrivateKey({ provider: web3authProvider });
    uiConsole("Private Key", privateKey);
  };

  const onGetAccounts = async () => {
    if (!web3authProvider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const userAccount = await getAccounts(web3authProvider);
    uiConsole("Address", userAccount);
  };

  const onDeployAccount = async () => {
    if (!web3authProvider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const userAccount = await deployAccount({
      web3authProvider,
      starknetProvider: starknetProvider,
    });
    uiConsole("Address", userAccount);
  };

  const onGetBalance = async () => {
    if (!web3authProvider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const balance = await getBalance({
      web3authProvider,
      starknetProvider: starknetProvider,
    });
    uiConsole("Balance", balance);
  };

  const loggedInView = (
    <div className="grid">
      {/* Funding Notice */}
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
    <div className="container">
      <h1 className="title">
        <a
          target="_blank"
          href="https://web3auth.io/docs/sdk/pnp/web/no-modal"
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

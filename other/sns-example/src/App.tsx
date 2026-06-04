import "./App.css";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { Balance } from "./components/getBalance";
import { SignTransaction } from "./components/signTransaction";
import { SendVersionedTransaction } from "./components/sendVersionedTransaction";
import { SignMessage } from "./components/signMessage";
import { SwitchChain } from "./components/switchNetwork";
import { SNS } from "./components/sns";

function App() {
  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } =
    useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { accounts } = useSolanaWallet();

  function uiConsole(...args: unknown[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <div className="grid">
      <h2>Connected to {connectorName}</h2>
      <div>{accounts?.[0]}</div>
      <div className="flex-container">
        <div>
          <button onClick={() => uiConsole(userInfo)} className="card" type="button">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={() => disconnect()} className="card" type="button">
            Log Out
          </button>
          {disconnectLoading && <div className="loading">Disconnecting...</div>}
          {disconnectError && <div className="error">{disconnectError.message}</div>}
        </div>
      </div>
      <SNS />
      <Balance />
      <SignMessage />
      <SignTransaction />
      <SendVersionedTransaction />
      <SwitchChain />
    </div>
  );

  const unloggedInView = (
    <div className="grid">
      <button onClick={() => connect()} className="card" type="button">
        Login
      </button>
      {connectLoading && <div className="loading">Connecting...</div>}
      {connectError && <div className="error">{connectError.message}</div>}
    </div>
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
        & Solana SNS Example
      </h1>

      {isConnected ? loggedInView : unloggedInView}
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-examples/tree/main/other/sns-example"
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

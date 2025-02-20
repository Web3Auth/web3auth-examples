import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK, IWeb3AuthCoreOptions, IAdapter } from "@web3auth/base";
import { AuthAdapter, AuthLoginParams } from "@web3auth/auth-adapter";
import { WalletConnectV2Adapter, getWalletConnectV2Settings } from "@web3auth/wallet-connect-v2-adapter";
import { WalletConnectModal } from "@walletconnect/modal";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { getInjectedAdapters } from "@web3auth/default-evm-adapter";
import "./App.css";
import RPC from "./web3RPC"; // for using web3.js
//import RPC from "./ethersRPC"; // for using ethers.js
//import RPC from "./viemRPC"; // for using viem

const clientId = "BHgArYmWwSeq21czpcarYh0EVq2WWOzflX-NTK-tY1-1pauPzHKRRLgpABkmYiIV_og9jAvoIxQ8L3Smrwe04Lw"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Please use 0x1 for Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

let injectedAdapters: any;
function App() {
  const [web3auth, setWeb3Auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(false);
  const [walletServicesPlugin, setWalletServicesPlugin] = useState<WalletServicesPlugin | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
        const web3authNoModalOptions: IWeb3AuthCoreOptions = {
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
          uiConfig: {
            appName: "W3A Heroes",
            appUrl: "https://web3auth.io",
            logoLight: "https://web3auth.io/images/web3authlog.png",
            logoDark: "https://web3auth.io/images/web3authlogodark.png",
            defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
            mode: "dark", // whether to enable dark mode. defaultValue: false
            theme: {
              primary: "#768729",
            },
            useLogoLoader: true,
          },
          useCoreKitKey: true,
        };
        const web3auth = new Web3AuthNoModal(web3authNoModalOptions);

        const authAdapter = new AuthAdapter({
          adapterSettings: {
            uxMode: UX_MODE.REDIRECT,
            // buildEnv: "testing",
            loginConfig: {
              email_passwordless: {
                verifier: "w3a-email-passwordless-demo",
                typeOfLogin: "email_passwordless",
                clientId,
              },
            },
            mfaSettings: {
              deviceShareFactor: {
                enable: true,
                priority: 1,
                mandatory: true,
              },
              backUpShareFactor: {
                enable: true,
                priority: 2,
                mandatory: false,
              },
              socialBackupFactor: {
                enable: true,
                priority: 3,
                mandatory: false,
              },
              passwordFactor: {
                enable: true,
                priority: 4,
                mandatory: true,
              },
              passkeysFactor: {
                enable: true,
                priority: 5,
                mandatory: false,
              },
              authenticatorFactor: {
                enable: true,
                priority: 6,
                mandatory: false,
              },
            },
          },
          loginSettings: {
            mfaLevel: "optional",
          },
          privateKeyProvider,
        });
        web3auth.configureAdapter(authAdapter);

        // adding wallet connect v2 adapter
        const defaultWcSettings = await getWalletConnectV2Settings(CHAIN_NAMESPACES.EIP155, ["0x1", "0xaa36a7"], "04309ed1007e77d1f119b85205bb779d");
        const walletConnectModal = new WalletConnectModal({ projectId: "04309ed1007e77d1f119b85205bb779d" });
        const walletConnectV2Adapter = new WalletConnectV2Adapter({
          adapterSettings: {
            qrcodeModal: walletConnectModal,
            ...defaultWcSettings.adapterSettings,
          },
          loginSettings: { ...defaultWcSettings.loginSettings },
        });
        web3auth.configureAdapter(walletConnectV2Adapter);

        injectedAdapters = await getInjectedAdapters({ options: web3authNoModalOptions });
        injectedAdapters.forEach((adapter: IAdapter<unknown>) => {
          web3auth.configureAdapter(adapter);
        });

        const walletServicesPluginInstance = new WalletServicesPlugin({
          wsEmbedOpts: {},
          walletInitOptions: { whiteLabel: { showWidgetButton: true } },
        });

        setWalletServicesPlugin(walletServicesPluginInstance);
        web3auth.addPlugin(walletServicesPluginInstance);

        setWeb3Auth(web3auth);
        await web3auth.init();
        setProvider(web3auth.provider);
        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const loginWithSMS = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo<AuthLoginParams>(WALLET_ADAPTERS.AUTH, {
      loginProvider: "sms_passwordless",
      extraLoginOptions: {
        login_hint: phoneNumber.trim(),
      },
    });
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const loginWithEmail = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "email_passwordless",
      extraLoginOptions: {
        login_hint: email.trim(),
      },
    });
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const loginWCModal = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.WALLET_CONNECT_V2);
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

  const addChain = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const newChain = {
      chainId: "0xaa36a7", // for wallet connect make sure to pass in this chain in the loginSettings of the adapter.
      displayName: "Ethereum Sepolia",
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      tickerName: "Ethereum Sepolia",
      ticker: "ETH",
      rpcTarget: "https://rpc.ankr.com/eth_sepolia",
      blockExplorerUrl: "https://sepolia.etherscan.io",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    };
    await web3auth?.addChain(newChain);
    uiConsole("New Chain Added");
  };

  const switchChain = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    await web3auth?.switchChain({ chainId: "0xaa36a7" });
    uiConsole("Chain Switched");
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
  };

  const showWalletUi = async () => {
    if (!walletServicesPlugin) {
      uiConsole("provider not initialized yet");
      return;
    }
    await walletServicesPlugin.showWalletUi();
  };

  const showWalletConnectScanner = async () => {
    if (!walletServicesPlugin) {
      uiConsole("provider not initialized yet");
      return;
    }
    await walletServicesPlugin.showWalletConnectScanner();
  };

  const showCheckout = async () => {
    if (!walletServicesPlugin) {
      uiConsole("provider not initialized yet");
      return;
    }
    await walletServicesPlugin.showCheckout();
  };

  const showSwap = async () => {
    if (!walletServicesPlugin) {
      uiConsole("provider not initialized yet");
      return;
    }
    await walletServicesPlugin.showSwap();
  };

  const loginWithInjected = async (adapterName: string) => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(adapterName);
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getChainId} className="card">
            Get Chain ID
          </button>
        </div>
        <div>
          <button onClick={addChain} className="card">
            Add Chain
          </button>
        </div>
        <div>
          <button onClick={switchChain} className="card">
            Switch Chain
          </button>
        </div>
        <div>
          <button onClick={showWalletUi} className="card">
            Show Wallet UI
          </button>
        </div>
        <div>
          <button onClick={showWalletConnectScanner} className="card">
            Show Wallet Connect Scanner
          </button>
        </div>
        <div>
          <button onClick={showCheckout} className="card">
            Show Checkout (Fiat to Crypto)
          </button>
        </div>
        <div>
          <button onClick={showSwap} className="card">
            Swap
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={getPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
      </div>
    </>
  );

  const unloggedInView = (
    <div className="login-container">
      <button onClick={login} className="card">
        Login
      </button>
      <div className="input-button-group">
        <input type="text" placeholder="+65-XXXXXXX" required onChange={(e) => setPhoneNumber(e.target.value)} />
        <button onClick={loginWithSMS} className="card login-button">
          SMS Login
        </button>
      </div>
      <div className="input-button-group">
        <input type="email" placeholder="username@email.io" required onChange={(e) => setEmail(e.target.value)} />
        <button onClick={loginWithEmail} className="card login-button">
          Email Login
        </button>
      </div>
      <button onClick={loginWCModal} className="card">
        Login with Wallet Connect v2
      </button>

      {injectedAdapters?.map((adapter: IAdapter<unknown>) => (
        <button key={adapter.name.toUpperCase()} onClick={() => loginWithInjected(adapter.name)} className="card">
          Login with {adapter.name.charAt(0).toUpperCase() + adapter.name.slice(1)} Wallet
        </button>
      ))}
    </div>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth
        </a>{" "}
        NoModal React-Vite Ethereum Example
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/blockchain-connection-examples/evm-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fblockchain-connection-examples%2Fevm-no-modal-example&project-name=w3a-evm-no-modal&repository-name=w3a-evm-no-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </div>
  );
}

export default App;

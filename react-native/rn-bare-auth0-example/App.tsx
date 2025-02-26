import * as WebBrowser from "@toruslabs/react-native-web-browser";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import Web3Auth, { ChainNamespace, LOGIN_PROVIDER } from "@web3auth/react-native-sdk";
import React, { useEffect, useState } from "react";
import { Button, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";

// import RPC from './web3RPC'; // for using web3.js
import RPC from "./ethersRPC"; // for using ethers.js

const scheme = "web3authrnbareauth0example"; // Or your desired app redirection scheme
const redirectUrl = "web3authrnbareauth0example://auth";
const clientId = "BLQmq83LgX8FRbjPcZ5lVX8EJUjrioOiw3YQd6qCoWs3Of8F2dZRD2nThUSLpbyKO7U3-bXe0D3j8hgjntShi40";

const chainConfig = {
  chainNamespace: ChainNamespace.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  decimals: 18,
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig,
  },
});

const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
  clientId,
  network: "testnet", // or other networks
  redirectUrl,
  useCoreKitKey: true,
  loginConfig: {
    jwt: {
      verifierSubIdentifier: "google-shubs",
      clientId: "1015336103925-reqktqs0ns9vfaeh7nbt8mi634u9157k.apps.googleusercontent.com",
      typeOfLogin: "google",
      verifier: "google-auth0-gooddollar",
    },
  },
});

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [console, setConsole] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      // IMP START - SDK Initialization
      await web3auth.init();

      if (web3auth.privKey) {
        await ethereumPrivateKeyProvider.setupProvider(web3auth.privKey);
        // IMP END - SDK Initialization
        setProvider(ethereumPrivateKeyProvider);
        setLoggedIn(true);
      }
    };
    init();
  }, []);

  const login = async () => {
    // try {
    setConsole("Logging in");
    await web3auth.login({
      loginProvider: LOGIN_PROVIDER.JWT,
      mfaLevel: "none",
    });

    uiConsole("Logged In");
    if (web3auth.privKey) {
      await ethereumPrivateKeyProvider.setupProvider(web3auth.privKey);
      // IMP END - Login
      setProvider(ethereumPrivateKeyProvider);
      uiConsole("Logged In");
      setLoggedIn(true);
    }
    // } catch (e) {
    //   uiConsole("error:", e);
    // }
  };

  const logout = async () => {
    if (!web3auth) {
      setConsole("Web3auth not initialized");
      return;
    }

    setConsole("Logging out");
    await web3auth.logout();

    if (!web3auth.privKey) {
      setProvider(null);
      uiConsole("Logged out");
      setLoggedIn(false);
    }
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    setConsole("Getting chain id");
    const networkDetails = await rpc.getChainId();
    uiConsole(networkDetails);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    setConsole("Getting account");
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    setConsole("Fetching balance");
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    setConsole("Sending transaction");
    const tx = await rpc.sendTransaction();
    uiConsole(tx);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    setConsole("Signing message");
    const message = await rpc.signMessage();
    uiConsole(message);
  };

  const launchWalletServices = async () => {
    if (!web3auth) {
      setConsole("Web3auth not initialized");
      return;
    }

    setConsole("Launch Wallet Services");
    await web3auth.launchWalletServices(chainConfig);
  };

  const requestSignature = async () => {
    if (!web3auth) {
      setConsole("Web3auth not initialized");
      return;
    }
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);

    const address = await rpc.getAccounts();

    // const params = [
    //   {
    //     challenge: 'Hello World',
    //     address,
    //   },
    //   null,
    // ];
    const params = ["Hello World", address];
    // const params = [{ }];
    // params.push('Hello World');
    // params.push(address);

    // const params = [
    //   address,
    //   {
    //     types: {
    //       EIP712Domain: [
    //         {
    //           name: 'name',
    //           type: 'string',
    //         },
    //         {
    //           name: 'version',
    //           type: 'string',
    //         },
    //         {
    //           name: 'chainId',
    //           type: 'uint256',
    //         },
    //         {
    //           name: 'verifyingContract',
    //           type: 'address',
    //         },
    //       ],
    //       Person: [
    //         {
    //           name: 'name',
    //           type: 'string',
    //         },
    //         {
    //           name: 'wallet',
    //           type: 'address',
    //         },
    //       ],
    //       Mail: [
    //         {
    //           name: 'from',
    //           type: 'Person',
    //         },
    //         {
    //           name: 'to',
    //           type: 'Person',
    //         },
    //         {
    //           name: 'contents',
    //           type: 'string',
    //         },
    //       ],
    //     },
    //     primaryType: 'Mail',
    //     domain: {
    //       name: 'Ether Mail',
    //       version: '1',
    //       chainId: chainConfig.chainId,
    //       verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    //     },
    //     message: {
    //       from: {
    //         name: 'Cow',
    //         wallet: address,
    //       },
    //       to: {
    //         name: 'Bob',
    //         wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    //       },
    //       contents: 'Hello, Bob!',
    //     },
    //   },
    // ];

    setConsole("Request Signature");
    const res = await web3auth.request(chainConfig, "personal_sign", params);
    uiConsole(res);
  };

  const uiConsole = (...args: unknown[]) => {
    setConsole(`${JSON.stringify(args || {}, null, 2)}\n\n\n\n${console}`);
  };

  const loggedInView = (
    <View style={styles.buttonArea}>
      <Button title="Get User Info" onPress={() => uiConsole(web3auth.userInfo())} />
      <Button title="Get Chain ID" onPress={() => getChainId()} />
      <Button title="Get Accounts" onPress={() => getAccounts()} />
      <Button title="Get Balance" onPress={() => getBalance()} />
      <Button title="Send Transaction" onPress={() => sendTransaction()} />
      <Button title="Sign Message" onPress={() => signMessage()} />
      <Button title="Show Wallet UI" onPress={() => launchWalletServices()} />
      <Button title="Request Signature from Wallet Services" onPress={() => requestSignature()} />
      <Button title="Log Out" onPress={() => logout()} />
    </View>
  );

  const unloggedInView = (
    <View style={styles.buttonArea}>
      <Button title="Login with Web3Auth" onPress={() => login()} />
    </View>
  );

  return (
    <View style={styles.container}>
      {loggedIn ? loggedInView : unloggedInView}
      <View style={styles.consoleArea}>
        <Text style={styles.consoleText}>Console:</Text>
        <ScrollView style={styles.console}>
          <Text>{console}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 30,
  },
  consoleArea: {
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  console: {
    flex: 1,
    backgroundColor: "#CCCCCC",
    color: "#ffffff",
    padding: 10,
    width: Dimensions.get("window").width - 60,
  },
  consoleText: {
    padding: 10,
  },
  buttonArea: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 30,
  },
});

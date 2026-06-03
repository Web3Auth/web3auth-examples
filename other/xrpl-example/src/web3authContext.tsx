// IMP START - Quick Start
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/react";
import { XrplPrivateKeyProvider } from "@web3auth/modal/providers/xrpl-provider";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
// IMP END - Dashboard Registration

// Chain configuration for XRPL
const chain = {
  chainNamespace: CHAIN_NAMESPACES.XRPL,
  chainId: "0x6",
  rpcTarget: "https://testnet-ripple-node.tor.us",
  wsTarget: "wss://s.altnet.rippletest.net",
  ticker: "XRP",
  tickerName: "XRPL",
  displayName: "xrpl testnet",
  blockExplorerUrl: "https://testnet.xrpl.org",
  logo: "",
};

const privateKeyProvider = new XrplPrivateKeyProvider({
  config: { chain, chains: [chain] },
});

// IMP START - Config
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    privateKeyProvider,
    chains: [chain],
    defaultChainId: "0x6",
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  },
};
// IMP END - Config

export default web3AuthContextConfig;

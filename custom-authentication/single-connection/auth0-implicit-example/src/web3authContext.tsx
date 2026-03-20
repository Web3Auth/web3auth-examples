import { WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal";

// IMP START - Dashboard Registration
const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
// IMP END - Dashboard Registration

// Instantiate SDK
const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,  
};

const web3AuthContextConfig = {
  web3AuthOptions
};

export default web3AuthContextConfig; 
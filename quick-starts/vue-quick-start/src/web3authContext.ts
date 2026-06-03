// IMP START - Quick Start
import { WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/vue";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
if (!clientId) {
  throw new Error(
    "Missing VITE_WEB3AUTH_CLIENT_ID. Copy .env.example to .env and set your Client ID."
  );
}
// IMP END - Dashboard Registration

// IMP START - Config
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  },
};
// IMP END - Config

export default web3AuthContextConfig;

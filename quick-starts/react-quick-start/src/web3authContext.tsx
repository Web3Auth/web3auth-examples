// IMP START - Quick Start
import "@sei-js/sei-global-wallet/eip6963"
import { WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/react";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BCqaSvZY2H0pd9asnWeOlI9J2j9WrVorFcBZwnMnnLb-ms8CBnJXD5nvZGMpzQxofkpHE0zYZLI7IQ_0dr3Vt9Q"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Config
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  }
};
// IMP END - Config

export default web3AuthContextConfig;

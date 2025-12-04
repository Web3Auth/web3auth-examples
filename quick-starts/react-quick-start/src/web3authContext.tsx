// IMP START - Quick Start
import { WEB3AUTH_NETWORK } from "@web3auth/modal";
import { coinbaseConnector } from "@web3auth/no-modal/connectors/coinbase-connector";
import { type Web3AuthContextConfig } from "@web3auth/modal/react";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BHgArYmWwSeq21czpcarYh0EVq2WWOzflX-NTK-tY1-1pauPzHKRRLgpABkmYiIV_og9jAvoIxQ8L3Smrwe04Lw"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Config
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    connectors: [coinbaseConnector({})],
  }
};
// IMP END - Config

export default web3AuthContextConfig;

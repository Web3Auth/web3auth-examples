// IMP START - Quick Start
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/react";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BFQ7nwOhZCudiAWFw_JH2-HC1hFIHTTTRmZ98m5Obup16JA-V-HS1QPW12uLaC5pFpRZQuOIzUGBcUJ8KDw2wZ0"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Instantiate SDK
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  }
};
// IMP END - Instantiate SDK

export default web3AuthContextConfig;

import { WALLET_CONNECTORS, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { Web3AuthContextConfig } from "@web3auth/modal/react";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    modalConfig: {
      connectors: {
        [WALLET_CONNECTORS.AUTH]: {
          label: "auth",
          loginMethods: {
            email_passwordless: {
              name: "email passwordless login",
              authConnectionId: "w3a-email-passwordless-demo"
            },
            sms_passwordless: {
              name: "sms passwordless login",
              authConnectionId: "w3a-sms-passwordless-dev-demo"
            }
          },
        }
      },
    },
  },
};

export default web3AuthContextConfig;

import { Buffer } from "buffer";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { DirectSecp256k1Wallet, OfflineDirectSigner } from "@cosmjs/proto-signing";

const rpc = "https://rpc.sentry-02.theta-testnet.polypore.xyz";

export const getChainId = async (): Promise<string> => {
  try {
    const client = await StargateClient.connect(rpc);
    const chainId = await client.getChainId();
    return chainId.toString();
  } catch (error) {
    return error as string;
  }
};

export const getAccounts = async (privateKey: string): Promise<any> => {
  try {
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const walletPromise = await DirectSecp256k1Wallet.fromKey(privateKeyBuffer as any, "cosmos");
    return (await walletPromise.getAccounts())[0].address;
  } catch (error) {
    return error;
  }
};

export const getBalance = async (privateKey: string): Promise<any> => {
  try {
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const walletPromise = await DirectSecp256k1Wallet.fromKey(privateKeyBuffer as any, "cosmos");
    const address = (await walletPromise.getAccounts())[0].address;
    const client = await StargateClient.connect(rpc);
    return await client.getAllBalances(address);
  } catch (error) {
    return error as string;
  }
};

export const signAndSendTransaction = async (privateKey: string): Promise<any> => {
  try {
    await StargateClient.connect(rpc);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const walletPromise = await DirectSecp256k1Wallet.fromKey(privateKeyBuffer, "cosmos");
    const fromAddress = (await walletPromise.getAccounts())[0].address;

    const destination = "cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he";

    const getSignerFromKey = async (): Promise<OfflineDirectSigner> => {
      return DirectSecp256k1Wallet.fromKey(privateKeyBuffer, "cosmos");
    };
    const signer: OfflineDirectSigner = await getSignerFromKey();

    const signingClient = await SigningStargateClient.connectWithSigner(rpc, signer);

    const result = await signingClient.sendTokens(
      fromAddress,
      destination,
      [{ denom: "uatom", amount: "250" }],
      {
        amount: [{ denom: "uatom", amount: "250" }],
        gas: "100000",
      },
    );
    const transactionHash = result.transactionHash;
    const height = result.height;
    return { transactionHash, height };
  } catch (error) {
    return error as string;
  }
};

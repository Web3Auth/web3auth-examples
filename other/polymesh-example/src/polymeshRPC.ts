import { BigNumber, Polymesh } from "@polymeshassociation/polymesh-sdk";
import { LocalSigningManager } from "@polymeshassociation/local-signing-manager";

let api: Polymesh;

const connectPolymesh = async (rawPrivateKey: string) => {
  if (!api) {
    console.log("Connecting to polymesh...");
    const formattedKey = "0x" + rawPrivateKey;
    const localSigningManager = await LocalSigningManager.create({
      accounts: [{ seed: formattedKey, derivationPath: "" }],
    });
    api = await Polymesh.connect({
      nodeUrl: "wss://testnet-rpc.polymesh.live",
      signingManager: localSigningManager,
    });
  }
};

export const getAccounts = async (rawPrivateKey: string) => {
  try {
    await connectPolymesh(rawPrivateKey);
    const key = api.accountManagement.getSigningAccount();
    if (key == null) throw new Error("No key found");
    const { address: ss58EncodedKey, key: rawPublicKey } = key;
    console.log(JSON.stringify({ ss58EncodedKey, rawPublicKey }));
    return { ss58EncodedKey, rawPublicKey };
  } catch (error) {
    console.error("Error", error);
  }
};

export const getIdentity = async (rawPrivateKey: string) => {
  try {
    await connectPolymesh(rawPrivateKey);
    const identity = await api.getSigningIdentity();
    console.log(`Signing Identity: ${identity?.did || "No identity found"}`);
    return identity?.did || "";
  } catch (error) {
    console.error("Error", error);
  }
};

export const getBalance = async (rawPrivateKey: string) => {
  try {
    await connectPolymesh(rawPrivateKey);
    const balance = await api.accountManagement.getAccountBalance();
    console.log(`Signing Key Balance: ${JSON.stringify(balance)}`);
    return balance;
  } catch (error) {
    return error;
  }
};

export const transferPolyx = async (rawPrivateKey: string) => {
  try {
    await connectPolymesh(rawPrivateKey);
    const amount = new BigNumber(1);
    const to = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
    const from = (await getAccounts(rawPrivateKey))?.ss58EncodedKey;

    const transferTx = await api.network.transferPolyx({ amount, to });

    await transferTx.run();

    const { txHash, blockNumber, blockHash, status, error, txIndex } = transferTx;

    return {
      amount,
      from,
      to,
      transactionHash: txHash,
      blockNumber: blockNumber?.toString(),
      txIndex: txIndex?.toString(),
      blockHash,
      status,
      error,
    };
  } catch (error) {
    console.error(error);
    return `Error: ${(error as Error).message}`;
  }
};

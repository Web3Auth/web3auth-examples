import algosdk from "algosdk";

export const makeClient = async (): Promise<algosdk.Algodv2> => {
  const algodToken = {
    "x-api-key": "yay5jiXMXr88Bi8nsG1Af9E1X3JfwGOC2F7222r3",
  };
  const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
  const algodPort = "";
  let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  return algodClient;
};

export const getAlgorandKeyPair = async (privateKey: string): Promise<algosdk.Account> => {
  const privateKeyUint8 = Uint8Array.from(Buffer.from(privateKey, "hex"));
  const passphrase = algosdk.secretKeyToMnemonic(privateKeyUint8);
  const keyPair = algosdk.mnemonicToSecretKey(passphrase);
  return keyPair;
};

export const getAccounts = async (privateKey: string): Promise<string> => {
  const keyPair = await getAlgorandKeyPair(privateKey);
  return keyPair.addr;
};

export const getBalance = async (privateKey: string): Promise<number> => {
  const keyPair = await getAlgorandKeyPair(privateKey);
  const client = await makeClient();
  const balance = await client.accountInformation(keyPair.addr).do();
  return balance.amount;
};

export const signMessage = async (privateKey: string): Promise<string> => {
  const keyPair = await getAlgorandKeyPair(privateKey);
  const client = await makeClient();
  const params = await client.getTransactionParams().do();
  const enc = new TextEncoder();
  const message = enc.encode("Web3Auth says hello!");
  const txn = algosdk.makePaymentTxnWithSuggestedParams(
    keyPair.addr,
    keyPair.addr,
    0,
    undefined,
    message,
    params
  );
  let signedTxn = algosdk.signTransaction(txn, keyPair.sk);
  let txId = signedTxn.txID;
  return txId;
};

export const signAndSendTransaction = async (privateKey: string): Promise<string | undefined> => {
  try {
    const keyPair = await getAlgorandKeyPair(privateKey);
    const client = await makeClient();
    const params = await client.getTransactionParams().do();
    const enc = new TextEncoder();
    const message = enc.encode("Web3Auth says hello!");

    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      keyPair.addr,
      keyPair.addr,
      1000,
      undefined,
      message,
      params
    );
    let signedTxn = algosdk.signTransaction(txn, keyPair.sk);

    const txHash = await client.sendRawTransaction(signedTxn.blob).do();

    return txHash.txId;
  } catch (error) {
    console.error("Error signing and sending transaction:", error);
    return undefined;
  }
};

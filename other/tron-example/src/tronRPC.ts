import TronWeb from "tronweb";

const TRON_SHASTA_RPC = "https://api.shasta.trongrid.io";
const RPC_URL = TRON_SHASTA_RPC;

export async function getTronAccount(privateKey: string): Promise<string> {
  try {
    const tronWeb = new TronWeb({
      fullHost: RPC_URL,
      privateKey: privateKey,
    });
    
    const address = tronWeb.address.fromPrivateKey(privateKey);
    return address;
  } catch (error) {
    console.error("Error getting account:", error);
    throw error;
  }
}

export async function getTronBalance(privateKey: string): Promise<string> {
  try {
    const tronWeb = new TronWeb({
      fullHost: RPC_URL,
      privateKey: privateKey,
    });
    
    const address = tronWeb.address.fromPrivateKey(privateKey);
    const balance = await tronWeb.trx.getBalance(address);
    
    return tronWeb.fromSun(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
}

export async function signMessage(privateKey: string): Promise<string> {
  try {
    const tronWeb = new TronWeb({
      fullHost: RPC_URL,
      privateKey: privateKey,
    });
    
    const message = "Hello Web3Auth + TRON!";
    const hexMessage = tronWeb.toHex(message);
    const signedMessage = await tronWeb.trx.sign(hexMessage);
    
    return signedMessage as string;
  } catch (error) {
    console.error("Error signing message:", error);
    throw error;
  }
}

export async function signAndSendTransaction(privateKey: string): Promise<string> {
  try {
    const tronWeb = new TronWeb({
      fullHost: RPC_URL,
      privateKey: privateKey,
    });
    
    const address = tronWeb.address.fromPrivateKey(privateKey);
    
    const transaction = await tronWeb.transactionBuilder.sendTrx(
      address,
      1000000,
      address
    );
    
    const signedTransaction = await tronWeb.trx.sign(transaction, privateKey);
    
    const result = await tronWeb.trx.sendRawTransaction(signedTransaction as object);
    
    return JSON.stringify(result);
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
}

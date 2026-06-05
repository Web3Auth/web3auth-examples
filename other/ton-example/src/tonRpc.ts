import { Buffer } from "buffer";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import TonWeb from "tonweb";

function getKeyPairFromPrivateKey(privateKey: string): { publicKey: Uint8Array; secretKey: Uint8Array } {
  const privateKeyBytes = new Uint8Array(privateKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

  if (privateKeyBytes.length !== 32) {
    const adjustedPrivateKey = new Uint8Array(32);
    adjustedPrivateKey.set(privateKeyBytes.slice(0, 32));
    return TonWeb.utils.nacl.sign.keyPair.fromSeed(adjustedPrivateKey);
  }

  return TonWeb.utils.nacl.sign.keyPair.fromSeed(privateKeyBytes);
}

async function getTonWeb(): Promise<TonWeb> {
  const rpc = await getHttpEndpoint({
    network: "testnet",
    protocol: "json-rpc",
  });
  return new TonWeb(new TonWeb.HttpProvider(rpc));
}

export function getChainId(): string {
  return "testnet";
}

export async function getAccounts(privateKey: string): Promise<string> {
  try {
    const keyPair = getKeyPairFromPrivateKey(privateKey);
    const tonweb = await getTonWeb();
    
    const WalletClass = tonweb.wallet.all['v3R2'];
    const wallet = new WalletClass(tonweb.provider, {
      publicKey: keyPair.publicKey
    });
    const address = await wallet.getAddress();
    return address.toString(true, true, true);
  } catch (error) {
    console.error("Error getting accounts:", error);
    throw new Error("Failed to get account address");
  }
}

export async function getBalance(privateKey: string): Promise<string> {
  try {
    const address = await getAccounts(privateKey);
    const tonweb = await getTonWeb();
    const balance = await tonweb.getBalance(address);
    return TonWeb.utils.fromNano(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    throw new Error("Failed to get balance");
  }
}

export async function signMessage(privateKey: string, message = "Hello, TON!"): Promise<string> {
  try {
    const keyPair = getKeyPairFromPrivateKey(privateKey);
    
    const messageBytes = new TextEncoder().encode(message);
    
    const signature = TonWeb.utils.nacl.sign.detached(messageBytes, keyPair.secretKey);
    
    return Buffer.from(signature).toString('hex');
  } catch (error) {
    console.error("Error signing message:", error);
    throw new Error("Failed to sign message");
  }
}

export async function signAndSendTransaction(privateKey: string): Promise<string> {
  try {
    const keyPair = getKeyPairFromPrivateKey(privateKey);
    const tonweb = await getTonWeb();
    
    const WalletClass = tonweb.wallet.all["v3R2"];
    const wallet = new WalletClass(tonweb.provider, { publicKey: keyPair.publicKey });

    const address = await wallet.getAddress();
    console.log("Wallet address:", address.toString(true, true, true));

    const balance = await tonweb.getBalance(address);
    console.log("Wallet balance:", TonWeb.utils.fromNano(balance.toString()));

    let seqno = await wallet.methods.seqno().call() ?? 0;
    console.log("Using seqno:", seqno);

    const transfer = wallet.methods.transfer({
      secretKey: keyPair.secretKey,
      toAddress: '0QCeWpE40bPUiuj-8ZfZd2VzMOxCMUuQFa_VKmdD8ssy5ukA',
      amount: TonWeb.utils.toNano('0.004'),
      seqno: seqno,
      payload: 'Hello, TON!',
      sendMode: 3,
    });

    console.log("Sending transaction...");
    const result = await transfer.send();
    
    console.log(result);
    return JSON.stringify(result);
  } catch (error) {
    console.error("Error sending transaction:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to send transaction: ${errorMessage}`);
  }
}

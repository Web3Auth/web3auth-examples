// Solana
import { Buffer } from "buffer";
import { Keypair, Connection } from "@solana/web3.js";
import { IProvider, getED25519Key } from "@web3auth/modal";
import nacl from "tweetnacl";

function getSolanaKeypair(ethPrivateKey: string): Keypair {
  const ethKeyBytes = Buffer.from(ethPrivateKey.replace(/^0x/, ""), "hex");
  const { sk } = getED25519Key(ethKeyBytes as never);
  return Keypair.fromSecretKey(sk);
}

async function getKeypairFromProvider(ethProvider: IProvider): Promise<Keypair> {
  const ethPrivateKey = (await ethProvider.request({
    method: "private_key",
  })) as string;
  return getSolanaKeypair(ethPrivateKey);
}

/**
 * Gets the Solana account address from a private key
 * @param ethProvider The Ethereum provider
 * @returns The Solana account address
 */
export async function getSolanaAccount(ethProvider: IProvider): Promise<string> {
  const keypair = await getKeypairFromProvider(ethProvider);
  return keypair.publicKey.toBase58();
}

/**
 * Gets the balance for a Solana account
 * @param ethProvider The Ethereum provider
 * @returns The account balance as a string
 */
export async function getSolanaBalance(ethProvider: IProvider): Promise<string> {
  const keypair = await getKeypairFromProvider(ethProvider);
  const connection = new Connection("https://api.devnet.solana.com");
  const balance = await connection.getBalance(keypair.publicKey);
  return balance.toString();
}

/**
 * Signs a message with a Solana account
 * @param ethProvider The Ethereum provider
 * @returns The signature as a base58 string
 */
export async function signSolanaMessage(ethProvider: IProvider): Promise<string> {
  try {
    const keypair = await getKeypairFromProvider(ethProvider);
    const messageBytes = new TextEncoder().encode("Hello Solana");
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
    return Buffer.from(signature).toString("base64");
  } catch (error) {
    console.error("Error signing Solana message:", error);
    throw error;
  }
}

/**
 * Sends a transaction on the Solana network
 * @param ethProvider The Ethereum provider
 * @returns The transaction signature
 */
export async function sendSolanaTransaction(ethProvider: IProvider): Promise<string> {
  try {
    const keypair = await getKeypairFromProvider(ethProvider);
    const connection = new Connection("https://api.devnet.solana.com");
    const { SystemProgram, Transaction, PublicKey, sendAndConfirmTransaction } = await import(
      "@solana/web3.js"
    );
    const toAccount = new PublicKey("7C4jsPZpht1JHMWmwDF5ZEVfGSBViXCKbQEcm2GKHtKQ");
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: toAccount,
      lamports: 100000,
    });
    const transaction = new Transaction().add(transferInstruction);
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    transaction.feePayer = keypair.publicKey;
    const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
    return signature;
  } catch (error) {
    console.error("Error sending Solana transaction:", error);
    throw error;
  }
}

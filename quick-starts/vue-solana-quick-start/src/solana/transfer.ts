import type { Transaction } from "@solana/kit";
import {
  address,
  appendTransactionMessageInstruction,
  compileTransaction,
  createNoopSigner,
  createSolanaRpc,
  createTransactionMessage,
  lamports,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

// Web3Auth signs transactions but does not build them. We use Solana Kit to
// build a version-0 SOL transfer that Web3Auth can then sign and/or send.
export async function buildSolTransferTransaction(
  rpcTarget: string,
  from: string,
  to: string,
  amountSol: number,
): Promise<Transaction> {
  const rpc = createSolanaRpc(rpcTarget);
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const feePayer = createNoopSigner(address(from));

  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(feePayer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) =>
      appendTransactionMessageInstruction(
        getTransferSolInstruction({
          source: feePayer,
          destination: address(to),
          amount: lamports(BigInt(Math.round(amountSol * 1e9))),
        }),
        m,
      ),
  );

  return compileTransaction(message);
}

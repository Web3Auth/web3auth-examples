import { FormEvent } from "react";
import { useSolanaWallet, useSignAndSendTransaction } from "@web3auth/modal/react/solana";
import {
  address,
  appendTransactionMessageInstruction,
  compileTransaction,
  createNoopSigner,
  createTransactionMessage,
  lamports,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

export function SendVersionedTransaction() {
  const { data: hash, error, loading: isPending, signAndSendTransaction } = useSignAndSendTransaction();
  const { accounts, rpc } = useSolanaWallet();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get("address") as string;
    const value = formData.get("value") as string;

    if (!rpc || !accounts) return;

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const feePayer = createNoopSigner(address(accounts[0]));
    const message = pipe(
      createTransactionMessage({ version: 0 }),
      (m) => setTransactionMessageFeePayerSigner(feePayer, m),
      (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
      (m) =>
        appendTransactionMessageInstruction(
          getTransferSolInstruction({
            source: feePayer,
            destination: address(to),
            amount: lamports(BigInt(Math.floor(Number(value) * 1e9))),
          }),
          m,
        ),
    );

    signAndSendTransaction(compileTransaction(message));
  }

  return (
    <div>
      <h2>Send Versioned Transaction</h2>
      <form onSubmit={submit}>
        <input name="address" placeholder="Address" required />
        <input
          name="value"
          placeholder="Amount (SOL)"
          type="number"
          step="0.01"
          required
        />
        <button disabled={isPending} type="submit">
          {isPending ? "Confirming..." : "Send"}
        </button>
      </form>
      {hash && <div>Transaction Hash: {hash}</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

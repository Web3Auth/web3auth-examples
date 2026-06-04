import { FormEvent, useState } from "react";
import { useSolanaWallet, useSignTransaction } from "@web3auth/modal/react/solana";

import { buildSolTransferTransaction } from "../solana/transfer";

// Build a SOL transfer with Solana Kit, then sign it with the embedded wallet
// WITHOUT broadcasting. `signedTransaction` is the base64 signed transaction.
export function SignTransaction() {
  const { accounts, rpc } = useSolanaWallet();
  const { data: signedTransaction, error, loading: isPending, signTransaction } = useSignTransaction();
  const [formError, setFormError] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (!rpc || !accounts?.length) return;

    const form = new FormData(e.currentTarget);
    const to = form.get("address")?.toString().trim() ?? "";
    const amountSol = Number(form.get("value"));
    if (!to || !Number.isFinite(amountSol) || amountSol <= 0) {
      setFormError("Enter a valid recipient address and a positive amount.");
      return;
    }

    try {
      const transaction = await buildSolTransferTransaction(rpc, accounts[0], to, amountSol);
      await signTransaction(transaction);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to sign transaction.");
    }
  }

  return (
    <div>
      <h2>Sign Transaction</h2>
      <form onSubmit={submit}>
        <input name="address" placeholder="Recipient address" required />
        <input name="value" placeholder="Amount (SOL)" type="number" step="0.01" min="0" required />
        <button disabled={isPending} type="submit">
          {isPending ? "Signing..." : "Sign"}
        </button>
      </form>
      {signedTransaction && <div className="hash">Signed transaction: {signedTransaction}</div>}
      {(formError ?? error?.message) && <div className="error">Error: {formError ?? error?.message}</div>}
    </div>
  );
}

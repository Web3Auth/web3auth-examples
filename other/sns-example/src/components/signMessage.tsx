import { FormEvent } from "react";
import { useSignMessage } from "@web3auth/modal/react/solana";

export function SignMessage() {
  const { data: signature, error, loading: isPending, signMessage } = useSignMessage();

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const message = new FormData(e.currentTarget).get("message")?.toString().trim();
    if (!message) return;
    void signMessage(message);
  }

  return (
    <div>
      <h2>Sign Message</h2>
      <form onSubmit={submit}>
        <input name="message" placeholder="Message" required />
        <button disabled={isPending} type="submit">
          {isPending ? "Signing..." : "Sign"}
        </button>
      </form>
      {signature && <div className="hash">Signature: {signature}</div>}
      {error && <div className="error">Error: {error.message}</div>}
    </div>
  );
}

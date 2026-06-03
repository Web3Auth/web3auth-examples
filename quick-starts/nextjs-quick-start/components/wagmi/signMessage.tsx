import { FormEvent } from "react";
import { useSignMessage, BaseError } from "wagmi";

export function SignMessage() {
  const { data: signature, error, isPending, signMessage } = useSignMessage()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const message = formData.get('message') as string
    signMessage({ message })
  }

  return (
    <div>
      <h2>Sign Message</h2>
      <form onSubmit={submit}>
        <input name="message" placeholder="Message" required />
        <button disabled={isPending} type="submit" className="card">
          {isPending ? 'Signing...' : 'Sign'}
        </button>
      </form>
      {signature && <div style={{ overflowWrap: "anywhere" }}>Signature: {signature}</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  )
}

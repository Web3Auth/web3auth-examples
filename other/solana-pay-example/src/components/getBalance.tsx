import { address } from "@solana/kit";
import { useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";

export function Balance() {
  const { accounts, rpc } = useSolanaWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchBalance() {
    if (!rpc || !accounts?.length) return;

    setIsLoading(true);
    setError(null);
    try {
      const { value } = await rpc.getBalance(address(accounts[0])).send();
      setBalance(`${Number(value) / 1e9} SOL`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch balance.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h2>Balance</h2>
      {balance && <div>{balance}</div>}
      <button onClick={() => void fetchBalance()} type="button" className="card" disabled={isLoading}>
        {isLoading ? "Fetching..." : "Fetch Balance"}
      </button>
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
}

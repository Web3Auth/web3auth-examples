import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { address } from "@solana/kit";
import { useEffect, useState } from "react";

export function Balance() {
  const { accounts, rpc } = useSolanaWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!rpc || !accounts || accounts.length === 0) return;
    try {
      setIsLoading(true);
      setError(null);
      const { value } = await rpc.getBalance(address(accounts[0])).send();
      setBalance(Number(value) / 1e9);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [rpc, accounts]);

  return (
    <div>
      <h2>Balance</h2>
      <div>
        {balance !== null && `${balance} SOL`}
      </div>
      {isLoading && <span className="loading">Loading...</span>}
      {error && <span className="error">Error: {error}</span>}
      <button onClick={fetchBalance} type="submit" className="card">
        Fetch Balance
      </button>
    </div>
  );
}

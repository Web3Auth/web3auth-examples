import { useSwitchChain, useWeb3Auth } from "@web3auth/modal/react";

export function SwitchChain() {
  const { web3Auth } = useWeb3Auth();
  const { switchChain, loading, error } = useSwitchChain();

  return (
    <div>
      <h2>Switch Chain</h2>
      <h3>Connected to {web3Auth?.currentChain?.displayName}</h3>
      {web3Auth?.coreOptions.chains?.map((chain) => (
        <button
          key={chain.chainId}
          type="button"
          className="card"
          disabled={loading || web3Auth?.currentChain?.chainId === chain.chainId}
          onClick={() => switchChain(chain.chainId)}
        >
          {chain.displayName}
        </button>
      ))}
      {loading && <div className="loading">Switching chain...</div>}
      {error && <div className="error">Error: {error.message}</div>}
    </div>
  );
}

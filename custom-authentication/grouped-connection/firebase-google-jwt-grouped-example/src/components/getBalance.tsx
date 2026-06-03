import { useConnection, useBalance } from "wagmi";
import { formatUnits } from "viem";

export function Balance() {
  const { address } = useConnection()

  const { data, isLoading, error } = useBalance({ address })

  return (
    <div>
      <h2>Balance</h2>
      <div>{data?.value !== undefined && `${formatUnits(data.value, data.decimals)} ${data.symbol}`} {isLoading && 'Loading...'} {error && 'Error: ' + error.message}</div>
    </div>
  )
}
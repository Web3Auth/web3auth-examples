import {
  createWalletClient,
  createPublicClient,
  custom,
  formatUnits,
  parseEther,
  type Hex,
} from "viem";
import { mainnet, polygonAmoy, sepolia } from "viem/chains";
import type { IProvider } from "@web3auth/modal";

export const SUPPORTED_CHAINS = [mainnet, sepolia, polygonAmoy] as const;

const getViewChain = (provider: IProvider) => {
  const chainId = provider.chainId;
  if (chainId === "0x1" || chainId === "1") return mainnet;
  if (chainId === "0x13882") return polygonAmoy;
  if (chainId === "0xaa36a7") return sepolia;
  return mainnet;
};

const createClients = (provider: IProvider) => {
  const chain = getViewChain(provider);
  const publicClient = createPublicClient({
    chain,
    transport: custom(provider),
  });
  const walletClient = createWalletClient({
    chain,
    transport: custom(provider),
  });
  return { chain, publicClient, walletClient };
};

const getAddress = async (provider: IProvider): Promise<Hex | undefined> => {
  const { walletClient } = createClients(provider);
  const [address] = await walletClient.getAddresses();
  return address;
};

const getBalance = async (provider: IProvider) => {
  const { publicClient, walletClient, chain } = createClients(provider);
  const [address] = await walletClient.getAddresses();
  if (!address) throw new Error("No account found");

  const balance = await publicClient.getBalance({ address });
  return {
    value: balance,
    decimals: chain.nativeCurrency.decimals,
    symbol: chain.nativeCurrency.symbol,
    formatted: formatUnits(balance, chain.nativeCurrency.decimals),
  };
};

const sendTransaction = async (
  provider: IProvider,
  to: Hex,
  value: string,
) => {
  const { publicClient, walletClient } = createClients(provider);
  const [account] = await walletClient.getAddresses();
  if (!account) throw new Error("No account found");

  const hash = await walletClient.sendTransaction({
    account,
    to,
    value: parseEther(value),
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return { hash, receipt };
};

const signMessage = async (provider: IProvider, message: string) => {
  const { walletClient } = createClients(provider);
  const [account] = await walletClient.getAddresses();
  if (!account) throw new Error("No account found");

  return walletClient.signMessage({ account, message });
};

export default { getAddress, getBalance, sendTransaction, signMessage };

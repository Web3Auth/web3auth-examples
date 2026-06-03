import { Account, CallData, Contract, ec, hash, RpcProvider } from "starknet";
import { keccak256 } from "js-sha3";
import { CONTRACT_ADDRESS } from "./address";
import { CONTRACT_ABI } from "./abi";

export const OZ_ACCOUNT_CLASS_HASH =
  "0x540d7f5ec7ecf317e68d48564934cb99259781b1ee3cedbbc37ec5337f8e688";

/*
  Starknet uses a specific elliptic curve (Stark curve), which has a much smaller valid private key range than secp256k1 (used by EVM chains). The private key you receive from Web3Auth might be a random 32-byte value, which can sometimes be out of Starknet's valid range.
  check out: https://web3auth.io/community/t/integrate-web3auth-on-starknet/11404/2?u=stephaniegb.dev for more context
  */

export function getStarkKey({ privateKey }: { privateKey: string }) {
  try {
    return ec.starkCurve.getStarkKey(privateKey);
  } catch (error) {
    console.error("Error generating StarkNet public key:", error);
    throw error;
  }
}

/**
 * Grinds a raw Web3Auth private key to a valid Starknet private key.
 * Hashes the key and reduces modulo Stark curve order.
 */
export function getPrivateKey(rawPrivateKey: string): string {
  try {
    if (!rawPrivateKey) {
      throw new Error("Private key is undefined or null");
    }

    const hashedPrivKey = keccak256(rawPrivateKey);

    const starkCurveOrder =
      "3618502788666131213697322783095070105526743751716087489154079457884512865583";

    const validPrivKey = BigInt("0x" + hashedPrivKey) % BigInt(starkCurveOrder);

    return `0x${validPrivKey.toString(16)}`;
  } catch (error) {
    console.error("Error getting/grinding private key:", error);
    throw new Error("Failed to retrieve or grind private key");
  }
}

export async function getAccounts(rawPrivateKey: string): Promise<any> {
  const validPrivateKey = getPrivateKey(rawPrivateKey);
  const starkKeyPub = getStarkKey({ privateKey: validPrivateKey });
  const OZaccountConstructorCallData = CallData.compile({
    publicKey: starkKeyPub,
  });

  const OZcontractAddress = hash.calculateContractAddressFromHash(
    starkKeyPub,
    OZ_ACCOUNT_CLASS_HASH,
    OZaccountConstructorCallData,
    0
  );

  return OZcontractAddress;
}

export async function getBalance({
  privateKey,
  starknetProvider,
}: {
  privateKey: string;
  starknetProvider: RpcProvider;
}): Promise<any> {
  if (!privateKey || !starknetProvider) {
    return;
  }

  try {
    const contract = new Contract(
      CONTRACT_ABI,
      CONTRACT_ADDRESS,
      starknetProvider
    );
    const address = await getAccounts(privateKey);
    const balance = await contract.balance_of(address);

    const balanceValue = balance.balance || balance;
    const formattedBalance = (
      Number(balanceValue.toString()) / Math.pow(10, 18)
    ).toFixed(6);

    return formattedBalance;
  } catch (error) {
    console.log("Error fetching balance:", error);
  }
}

export async function deployAccount({
  privateKey,
  starknetProvider,
}: {
  privateKey: string;
  starknetProvider: RpcProvider;
}) {
  if (!privateKey || !starknetProvider) {
    return;
  }
  try {
    const validPrivateKey = getPrivateKey(privateKey);
    console.log("✅ Grinded private key:", validPrivateKey);

    const starkKeyPub = getStarkKey({ privateKey: validPrivateKey });
    console.log("✅ StarkNet public key:", starkKeyPub);

    const OZaccountConstructorCallData = CallData.compile({
      publicKey: starkKeyPub,
    });

    const OZcontractAddress = hash.calculateContractAddressFromHash(
      starkKeyPub,
      OZ_ACCOUNT_CLASS_HASH,
      OZaccountConstructorCallData,
      0
    );

    console.log("✅ Calculated address:", OZcontractAddress);

    const OZaccount = new Account(
      starknetProvider,
      OZcontractAddress,
      validPrivateKey
    );

    console.log("✅ Account instance created");

    const { transaction_hash, contract_address } =
      await OZaccount.deployAccount({
        classHash: OZ_ACCOUNT_CLASS_HASH,
        constructorCalldata: OZaccountConstructorCallData,
        contractAddress: OZcontractAddress,
        addressSalt: starkKeyPub,
      });

    await starknetProvider.waitForTransaction(transaction_hash);
    console.log("🎉 Final deployed address:", contract_address);

    return {
      transaction_hash,
      contract_address,
    };
  } catch (error) {
    console.error("❌ Account deployment failed:", error);
    throw error;
  }
}

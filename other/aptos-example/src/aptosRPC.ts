import { Account, Aptos, AptosConfig, Network, Secp256k1PrivateKey } from "@aptos-labs/ts-sdk";

interface CoinStoreResource {
  type: string;
  data: {
    coin: {
      value: string;
    };
    deposit_events: any;
    frozen: boolean;
    withdraw_events: any;
  };
}

const APTOS_COIN: `${string}::${string}::${string}` = "0x1::aptos_coin::AptosCoin";

export async function getAptosAccount(privateKey: string): Promise<Account> {
  try {
    const privateKeyUint8Array = new Uint8Array(privateKey.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
    const secp256k1PrivateKey = new Secp256k1PrivateKey(privateKeyUint8Array);
    return Account.fromPrivateKey({ privateKey: secp256k1PrivateKey });
  } catch (error) {
    throw new Error("Failed to create Aptos account");
  }
}

export async function getAccounts(privateKey: string): Promise<string> {
  try {
    const aptosAccount = await getAptosAccount(privateKey);
    return aptosAccount.accountAddress.toString();
  } catch (error) {
    throw new Error("Failed to get Aptos account address");
  }
}

export async function getAirdrop(accountAddress: string, amount: number): Promise<any> {
  try {
    console.log(`Requesting airdrop for account: ${accountAddress} with amount: ${amount}`);
    
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
    
    const transaction = await aptos.fundAccount({
      accountAddress: accountAddress,
      amount: amount,
    });
    console.log(`Airdrop transaction hash: ${transaction.hash}`);

    console.log("\n=== Waiting for result of airdrop transaction ===\n");
    const executedTransaction = await aptos.waitForTransaction({
      transactionHash: transaction.hash,
    });
    console.log("Airdrop executed:", executedTransaction);

    return executedTransaction;
  } catch (error) {
    console.error("Failed to airdrop funds. You may be rate limited or encountered another issue:", error);
    throw new Error("Airdrop failed.");
  }
}

export async function getBalance(accountAddress: string): Promise<number> {
  try {
    console.log(`Fetching balance for account: ${accountAddress}`);
    
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
    
    const resources = await aptos.account.getAccountResources({ accountAddress });

    const coinResource = resources.find((resource: any) =>
      resource.type.includes("0x1::coin::CoinStore")
    ) as CoinStoreResource;

    if (!coinResource || !coinResource.data) {
      throw new Error("Coin resource not found for this account");
    }

    const balance = parseInt(coinResource.data.coin.value, 10);
    console.log(`Balance for account ${accountAddress}: ${balance}`);
    
    return balance;
  } catch (error) {
    console.error("Failed to get account balance:", error);
    throw new Error("Balance retrieval failed.");
  }
}

export async function sendTransaction(privateKey: string): Promise<string> {
  try {
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
    
    const aptosAccount = await getAptosAccount(privateKey);

    const transaction = await aptos.transaction.build.simple({
      sender: aptosAccount.accountAddress,
      data: {
        function: "0x1::coin::transfer",
        typeArguments: [APTOS_COIN],
        functionArguments: [aptosAccount.accountAddress, "717"],
      },
    });

    const senderAuthenticator = await aptos.transaction.sign({ signer: aptosAccount, transaction });

    const committedTxn = await aptos.transaction.submit.simple({ transaction, senderAuthenticator });

    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

    return committedTxn.hash;
  } catch (error) {
    console.error("Error in sendTransaction:", error);
    throw new Error("Failed to send transaction. Please check your balance and try again.");
  }
}

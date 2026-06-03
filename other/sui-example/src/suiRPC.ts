import { CoinBalance, getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { MIST_PER_SUI } from '@mysten/sui.js/utils';
import { TransactionBlock } from '@mysten/sui.js/transactions';

const rpcUrl = getFullnodeUrl('devnet');
const suiClient = new SuiClient({ url: rpcUrl });

export async function getChainId(): Promise<string> {
    try {
        const chainId = await suiClient.getChainIdentifier();
        return chainId.toString();
    } catch (error) {
        return error as string;
    }
}

export async function getAccounts(privateKey: string): Promise<any> {
    try {
        const keypair = getKeyPair(privateKey);
        return keypair.toSuiAddress();
    } catch (error) {
        return error;
    }
}

export async function getBalance(privateKey: string): Promise<any> {
    try {
        const keypair = getKeyPair(privateKey);
        const suiBalance = await suiClient.getBalance({
            owner: keypair.toSuiAddress()
        });
        return balance(suiBalance);
    } catch (error) {
        return error as string;
    }
}

function balance(b: CoinBalance): number {
    return Number.parseInt(b.totalBalance) / Number(MIST_PER_SUI);
}

export async function sendTransaction(privateKey: string): Promise<any> {
    try {
        const keyPair = getKeyPair(privateKey);
        const tx = new TransactionBlock();
        
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(0.2 * Number(MIST_PER_SUI))]);
        tx.transferObjects([coin], tx.pure("0x7d42ef777fa6e46a7b19d54dc9353c898e7f1c65a3abab8b73f92fe5efe6d96d"));
        const result = await suiClient.signAndExecuteTransactionBlock({ signer: keyPair, transactionBlock: tx });
        return result.digest;
    } catch (error) {
        return error as string;
    }
}

function getKeyPair(privateKey: string): Ed25519Keypair {
    const privateKeyUint8Array = new Uint8Array(
        privateKey.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16))
    );
    return Ed25519Keypair.fromSecretKey(privateKeyUint8Array);
}

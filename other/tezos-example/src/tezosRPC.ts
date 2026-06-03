/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { hex2buf } from "@taquito/utils";
// @ts-ignore
import * as tezosCrypto from "@tezos-core-tools/crypto-utils";

const tezos = new TezosToolkit("https://rpc.tzbeta.net/");

export async function getTezosKeyPair(privateKey: string): Promise<any> {
  try {
    const keyPair = tezosCrypto.utils.seedToKeyPair(hex2buf(privateKey));
    return keyPair;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function setProvider(privateKey: string): Promise<void> {
  const keyPair = await getTezosKeyPair(privateKey);
  tezos.setSignerProvider(await InMemorySigner.fromSecretKey(keyPair?.sk as string));
}

export async function getAccounts(privateKey: string): Promise<any> {
  try {
    const keyPair = await getTezosKeyPair(privateKey);
    return keyPair?.pkh;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
}

export async function getBalance(privateKey: string): Promise<any> {
  try {
    const keyPair = await getTezosKeyPair(privateKey);
    console.log("keyPair", keyPair.pkh);
    const balance = await tezos.tz.getBalance(keyPair?.pkh as string);
    console.log("balance", balance);
    return balance;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
}

export async function signMessage(privateKey: string): Promise<any> {
  try {
    const keyPair = await getTezosKeyPair(privateKey);
    const signer = new InMemorySigner(keyPair.sk);
    const message = "0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad";
    const signature = await signer.sign(message);
    return signature;
  } catch (error) {
    return error;
  }
}

export async function signAndSendTransaction(privateKey: string): Promise<any> {
  try {
    await setProvider(privateKey);
    const address = "tz1dHzQTA4PGBk2igZ3kBrDsVXuvHdN8kvTQ";

    const op = await tezos.wallet
      .transfer({
        to: address,
        amount: 0.00005,
      })
      .send();

    const txRes = await op.confirmation();
    return txRes;
  } catch (error) {
    return error;
  }
}

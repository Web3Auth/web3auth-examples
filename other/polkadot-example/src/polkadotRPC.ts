/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";

export async function makeClient(): Promise<any> {
  console.log("Establishing connection to Rococo Relay Chain RPC...");
  const wsProvider = new WsProvider("wss://rococo-rpc.polkadot.io");
  const api = await ApiPromise.create({ provider: wsProvider });
  const resp = await api.isReady;
  console.log("Polkadot RPC is ready", resp);
  return api;
}

export async function getPolkadotKeyPair(privateKey: string): Promise<any> {
  await cryptoWaitReady();
  console.log("privateKey", `0x${privateKey}`);
  const keyring = new Keyring({ ss58Format: 42, type: "sr25519" });
  const keyPair = keyring.addFromUri(`0x${privateKey}`);
  console.log("keyPair", keyPair);
  return keyPair;
}

export async function getAccounts(privateKey: string): Promise<any> {
  const keyPair = await getPolkadotKeyPair(privateKey);
  return keyPair.address;
}

export async function getBalance(privateKey: string): Promise<any> {
  const keyPair = await getPolkadotKeyPair(privateKey);
  const api = await makeClient();
  const data = await api.query.system.account(keyPair.address);
  console.log(data);
  return data.toHuman();
}

export async function signAndSendTransaction(privateKey: string): Promise<any> {
  try {
    const keyPair = await getPolkadotKeyPair(privateKey);
    const api = await makeClient();
    const txHash = await api.tx.balances.transferKeepAlive("5Gzhnn1MsDUjMi7S4cN41CfggEVzSyM58LkTYPFJY3wt7o3d", 12345).signAndSend(keyPair);
    console.log(txHash);
    return txHash.toHuman();
  } catch (err: any) {
    return err.toString();
  }
}

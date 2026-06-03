import { Component, OnInit } from "@angular/core";
// IMP START - Quick Start
import { Web3Auth, WEB3AUTH_NETWORK, type CustomChainConfig } from "@web3auth/modal";
// IMP END - Quick Start
import { environment } from "../environments/environment";
import type { Hex } from "viem";

// IMP START - Blockchain Calls
import RPC from "./viemRPC";
// IMP END - Blockchain Calls

// IMP START - Dashboard Registration
const clientId = environment.clientId;
// IMP END - Dashboard Registration

// IMP START - Config
const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
});
// IMP END - Config

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  loggedIn = false;
  connectorName = "";
  address: Hex | undefined;
  chainId: string | null = null;
  chains: CustomChainConfig[] = [];

  connectLoading = false;
  connectError = "";
  disconnectLoading = false;
  disconnectError = "";

  balanceDisplay = "";
  balanceLoading = false;
  balanceError = "";

  sendPending = false;
  sendHash = "";
  sendConfirming = false;
  sendConfirmed = false;
  sendError = "";

  signPending = false;
  signature = "";
  signError = "";

  switchChainError = "";

  async ngOnInit() {
    try {
      // IMP START - SDK Initialization
      await web3auth.init();
      // IMP END - SDK Initialization
      this.chains = web3auth.coreOptions.chains ?? [];
      if (web3auth.connected) {
        await this.onConnected();
      }
    } catch (error) {
      console.error(error);
    }
  }

  login = async () => {
    this.connectLoading = true;
    this.connectError = "";
    try {
      // IMP START - Login
      await web3auth.connect();
      // IMP END - Login
      if (web3auth.connected) {
        await this.onConnected();
      }
    } catch (error) {
      this.connectError = error instanceof Error ? error.message : String(error);
    } finally {
      this.connectLoading = false;
    }
  };

  getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    this.uiConsole(user);
  };

  logout = async () => {
    this.disconnectLoading = true;
    this.disconnectError = "";
    try {
      // IMP START - Logout
      await web3auth.logout();
      // IMP END - Logout
      this.loggedIn = false;
      this.resetState();
    } catch (error) {
      this.disconnectError = error instanceof Error ? error.message : String(error);
    } finally {
      this.disconnectLoading = false;
    }
  };

  // IMP START - Blockchain Calls
  async refreshBalance() {
    const provider = this.getEthereumProvider();
    if (!provider) return;

    this.balanceLoading = true;
    this.balanceError = "";
    try {
      const balance = await RPC.getBalance(provider);
      this.balanceDisplay = `${balance.formatted} ${balance.symbol}`;
    } catch (error) {
      this.balanceError = error instanceof Error ? error.message : String(error);
    } finally {
      this.balanceLoading = false;
    }
  }

  async onSendTransaction(event: Event) {
    event.preventDefault();
    const provider = this.getEthereumProvider();
    if (!provider) return;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const to = formData.get("address") as Hex;
    const value = formData.get("value") as string;

    this.sendPending = true;
    this.sendError = "";
    this.sendHash = "";
    this.sendConfirmed = false;
    this.sendConfirming = false;

    try {
      this.sendConfirming = true;
      const { hash } = await RPC.sendTransaction(provider, to, value);
      this.sendHash = hash;
      this.sendConfirmed = true;
    } catch (error) {
      this.sendError = error instanceof Error ? error.message : String(error);
    } finally {
      this.sendPending = false;
      this.sendConfirming = false;
      await this.refreshBalance();
    }
  }

  async onSignMessage(event: Event) {
    event.preventDefault();
    const provider = this.getEthereumProvider();
    if (!provider) return;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const message = formData.get("message") as string;

    this.signPending = true;
    this.signError = "";
    this.signature = "";

    try {
      this.signature = await RPC.signMessage(provider, message);
    } catch (error) {
      this.signError = error instanceof Error ? error.message : String(error);
    } finally {
      this.signPending = false;
    }
  }

  async switchChain(chain: CustomChainConfig) {
    this.switchChainError = "";
    try {
      await web3auth.switchChain({ chainId: chain.chainId });
      this.chainId = web3auth.currentChainId;
      await this.refreshBlockchainState();
    } catch (error) {
      this.switchChainError = error instanceof Error ? error.message : String(error);
    }
  }
  // IMP END - Blockchain Calls

  uiConsole(...args: unknown[]) {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  private getEthereumProvider() {
    return web3auth.connection?.ethereumProvider ?? null;
  }

  private async onConnected() {
    this.loggedIn = true;
    this.connectorName = web3auth.primaryConnectorName ?? "Web3Auth";
    this.chains = web3auth.coreOptions.chains ?? [];
    this.chainId = web3auth.currentChainId;
    await this.refreshBlockchainState();
  }

  private async refreshBlockchainState() {
    const provider = this.getEthereumProvider();
    if (!provider) return;

    this.chainId = web3auth.currentChainId;
    this.address = await RPC.getAddress(provider);
    await this.refreshBalance();
  }

  private resetState() {
    this.connectorName = "";
    this.address = undefined;
    this.chainId = null;
    this.balanceDisplay = "";
    this.balanceError = "";
    this.sendHash = "";
    this.sendError = "";
    this.signature = "";
    this.signError = "";
    this.switchChainError = "";
  }
}

<template>
  <div class="container">
    <main class="main">
      <h2 class="title">
        <a target="_blank" href="https://docs.metamask.io/embedded-wallets/sdk/vue/" rel="noreferrer">
          Web3Auth
        </a>
        & Vue Solana Quick Start
      </h2>

      <div v-if="!isConnected" class="card-container">
        <button class="card" @click="connect()">Login</button>
        <div v-if="connectLoading" class="loading">Connecting...</div>
        <div v-if="connectError" class="error">{{ connectError.message }}</div>
      </div>

      <div v-else class="flex-col">
        <h2>Connected to {{ connectorName }}</h2>
        <div v-if="accounts?.[0]">{{ accounts[0] }}</div>
        <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))">
          <button class="card" @click="uiConsole(userInfo)">Get User Info</button>
          <button class="card" @click="disconnect()">Log Out</button>
        </div>
        <div v-if="disconnectLoading" class="loading">Disconnecting...</div>
        <div v-if="disconnectError" class="error">{{ disconnectError.message }}</div>
        <Balance />
        <SignMessage />
        <SignTransaction />
        <SendVersionedTransaction />
        <SwitchNetwork />
      </div>

      <div id="console"><p></p></div>

      <footer class="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-examples/tree/main/quick-starts/vue-solana-quick-start"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/modal/vue";
import { useSolanaWallet } from "@web3auth/modal/vue/solana";
import Balance from "./components/getBalance.vue";
import SignMessage from "./components/signMessage.vue";
import SignTransaction from "./components/signTransaction.vue";
import SendVersionedTransaction from "./components/sendVersionedTransaction.vue";
import SwitchNetwork from "./components/switchNetwork.vue";

const { accounts } = useSolanaWallet();
const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } =
  useWeb3AuthConnect();
const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
const { userInfo } = useWeb3AuthUser();

function uiConsole(...args: unknown[]) {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
    console.log(...args);
  }
}
</script>

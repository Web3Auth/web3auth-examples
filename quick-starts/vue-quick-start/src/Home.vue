<template>
  <div>
      <h1 class="title">
        <a target="_blank" href="https://docs.metamask.io/embedded-wallets/sdk/vue/" rel="noreferrer">
          Web3Auth
        </a>
        & Vue Modal Quick Start
      </h1>

      <!-- IMP START - Login -->
      <div v-if="!isConnected" class="grid">
        <button class="card" @click="connect()">Login</button>
        <div v-if="connectLoading" class="loading">Connecting...</div>
        <div v-if="connectError" class="error">{{ connectError.message }}</div>
      </div>
      <!-- IMP END - Login -->

      <div v-else class="grid">
        <h2>Connected to {{ connectorName }}</h2>
        <!-- IMP START - Blockchain Calls -->
        <div>{{ address }}</div>
        <!-- IMP END - Blockchain Calls -->
        <div class="flex-row">
          <button class="card" @click="uiConsole(userInfo)">Get User Info</button>
          <button class="card" @click="disconnect()">Log Out</button>
        </div>
        <div v-if="disconnectLoading" class="loading">Disconnecting...</div>
        <div v-if="disconnectError" class="error">{{ disconnectError.message }}</div>

        <!-- IMP START - Blockchain Calls -->
        <SendTransaction />
        <Balance />
        <SignMessage />
        <SwitchNetwork />
        <!-- IMP END - Blockchain Calls -->
      </div>

      <div id="console">
        <p></p>
      </div>

      <footer class="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-examples/tree/main/quick-starts/vue-quick-start"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
  </div>
</template>

<script setup lang="ts">
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/vue";
// IMP START - Blockchain Calls
import { useConnection } from "@wagmi/vue";
import SendTransaction from "./components/SendTransaction.vue";
import Balance from "./components/Balance.vue";
import SignMessage from "./components/SignMessage.vue";
import SwitchNetwork from "./components/SwitchNetwork.vue";
// IMP END - Blockchain Calls

// IMP START - Login
const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } =
  useWeb3AuthConnect();
// IMP END - Login

// IMP START - Logout
const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
// IMP END - Logout

const { userInfo } = useWeb3AuthUser();

// IMP START - Blockchain Calls
const { address } = useConnection();
// IMP END - Blockchain Calls

function uiConsole(...args: unknown[]) {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
    console.log(...args);
  }
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useWeb3Auth, useSwitchChain } from "@web3auth/modal/vue";

const { web3Auth, chainId } = useWeb3Auth();
const { switchChain, loading, error } = useSwitchChain();

const chains = computed(() => web3Auth.value?.coreOptions?.chains ?? []);
const currentChain = computed(() => chains.value.find((c) => c.chainId === chainId.value));
</script>

<template>
  <div>
    <h2>Switch Chain</h2>
    <h3>Connected to {{ currentChain?.displayName }}</h3>
    <button
      v-for="chain in chains"
      :key="chain.chainId"
      :disabled="loading || chainId === chain.chainId"
      type="button"
      class="card"
      @click="switchChain({ chainId: chain.chainId })"
    >
      {{ chain.displayName }}
    </button>
    <div v-if="loading" class="loading">Switching chain...</div>
    <div v-if="error" class="error">Error: {{ error.message }}</div>
  </div>
</template>

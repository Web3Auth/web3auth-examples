<script setup lang="ts">
import { useChainId, useSwitchChain } from "@wagmi/vue";

const chainId = useChainId();
const { chains, error, switchChain } = useSwitchChain();
</script>

<template>
  <div>
    <h2>Switch Chain</h2>
    <h3>Connected to {{ chainId }}</h3>
    <div class="set">
      <button
        v-for="chain in chains"
        :key="chain.id"
        :disabled="chainId === chain.id"
        class="card"
        type="button"
        @click="switchChain({ chainId: chain.id })"
      >
        {{ chain.name }}
      </button>
    </div>
    <div v-if="error" class="error">{{ error.message }}</div>
  </div>
</template>

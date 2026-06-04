<script setup lang="ts">
import { address } from "@solana/kit";
import { ref } from "vue";
import { useSolanaWallet } from "@web3auth/modal/vue/solana";

const { accounts, rpc } = useSolanaWallet();

const balance = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchBalance() {
  if (!rpc.value || !accounts.value?.length) return;

  loading.value = true;
  error.value = null;
  try {
    const { value } = await rpc.value.getBalance(address(accounts.value[0])).send();
    balance.value = `${Number(value) / 1e9} SOL`;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to fetch balance.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2>Balance</h2>
    <div v-if="balance">{{ balance }}</div>
    <button type="button" class="card" :disabled="loading" @click="fetchBalance">
      {{ loading ? "Fetching..." : "Fetch Balance" }}
    </button>
    <div v-if="error" class="error">Error: {{ error }}</div>
  </div>
</template>

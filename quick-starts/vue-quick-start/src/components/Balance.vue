<script setup lang="ts">
import { useConnection, useBalance } from "@wagmi/vue";
import { formatUnits } from "viem";

const { address } = useConnection();
const { data, isLoading, error } = useBalance({ address });
</script>

<template>
  <div>
    <h2>Balance</h2>
    <div v-if="data?.value !== undefined">
      {{ formatUnits(data.value, data.decimals) }} {{ data.symbol }}
    </div>
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-if="error" class="error">Error: {{ error.message }}</div>
  </div>
</template>

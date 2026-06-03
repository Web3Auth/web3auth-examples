<script setup lang="ts">
import { parseEther } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt, BaseError } from "@wagmi/vue";

const { data: hash, error, isPending, sendTransaction } = useSendTransaction();

function submit(event: Event) {
  const formData = new FormData(event.target as HTMLFormElement);
  const to = formData.get("address") as `0x${string}`;
  const value = formData.get("value") as string;
  sendTransaction({ to, value: parseEther(value) });
}

const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
  hash,
});
</script>

<template>
  <div>
    <h2>Send Transaction</h2>
    <form class="set" @submit.prevent="submit">
      <input name="address" placeholder="Address" required />
      <input
        name="value"
        placeholder="Amount (ETH)"
        type="number"
        step="0.000000001"
        required
      />
      <button type="submit" :disabled="isPending">
        {{ isPending ? "Confirming..." : "Send" }}
      </button>
    </form>
    <div v-if="hash">Transaction Hash: {{ hash }}</div>
    <div v-if="isConfirming">Waiting for confirmation...</div>
    <div v-if="isConfirmed">Transaction confirmed.</div>
    <div v-if="error" class="error">
      Error: {{ (error as BaseError).shortMessage || error.message }}
    </div>
  </div>
</template>

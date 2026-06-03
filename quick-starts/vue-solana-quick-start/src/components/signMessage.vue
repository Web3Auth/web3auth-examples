<script setup lang="ts">
import { useSignMessage } from "@web3auth/modal/vue/solana";

const { data: signature, error, loading: isPending, signMessage } = useSignMessage();

function submit(event: Event) {
  event.preventDefault();
  const message = new FormData(event.target as HTMLFormElement).get("message")?.toString().trim();
  if (!message) return;
  void signMessage(message);
}
</script>

<template>
  <div>
    <h2>Sign Message</h2>
    <form @submit.prevent="submit">
      <input name="message" placeholder="Message" required />
      <button type="submit" :disabled="isPending">
        {{ isPending ? "Signing..." : "Sign" }}
      </button>
    </form>
    <div v-if="signature" class="hash">Signature: {{ signature }}</div>
    <div v-if="error" class="error">Error: {{ error.message }}</div>
  </div>
</template>

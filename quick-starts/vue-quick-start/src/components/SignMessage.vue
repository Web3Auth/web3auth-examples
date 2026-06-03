<script setup lang="ts">
import { useSignMessage, BaseError } from "@wagmi/vue";

const { data: signature, error, isPending, signMessage } = useSignMessage();

function submit(event: Event) {
  const formData = new FormData(event.target as HTMLFormElement);
  const message = formData.get("message") as string;
  signMessage({ message });
}
</script>

<template>
  <div>
    <h2>Sign Message</h2>
    <form class="set" @submit.prevent="submit">
      <input name="message" placeholder="Message" required />
      <button type="submit" :disabled="isPending">
        {{ isPending ? "Signing..." : "Sign" }}
      </button>
    </form>
    <div v-if="signature" style="overflow-wrap: anywhere">Signature: {{ signature }}</div>
    <div v-if="error" class="error">
      Error: {{ (error as BaseError).shortMessage || error.message }}
    </div>
  </div>
</template>

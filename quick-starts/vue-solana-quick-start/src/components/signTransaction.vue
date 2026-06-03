<script setup lang="ts">
import { ref } from "vue";
import { useWeb3Auth } from "@web3auth/modal/vue";
import { useSolanaWallet, useSignTransaction } from "@web3auth/modal/vue/solana";

import { buildSolTransferTransaction } from "../solana/transfer";

// Build a SOL transfer with Solana Kit, then sign it with the embedded wallet
// WITHOUT broadcasting. `signedTransaction` is the base64 signed transaction.
const { web3Auth } = useWeb3Auth();
const { accounts } = useSolanaWallet();
const { data: signedTransaction, error, loading: isPending, signTransaction } = useSignTransaction();
const formError = ref<string | null>(null);

async function submit(event: Event) {
  event.preventDefault();
  formError.value = null;

  const rpcTarget = web3Auth.value?.currentChain?.rpcTarget;
  if (!rpcTarget || !accounts.value?.length) return;

  const form = new FormData(event.target as HTMLFormElement);
  const to = form.get("address")?.toString().trim() ?? "";
  const amountSol = Number(form.get("value"));
  if (!to || !Number.isFinite(amountSol) || amountSol <= 0) {
    formError.value = "Enter a valid recipient address and a positive amount.";
    return;
  }

  try {
    const transaction = await buildSolTransferTransaction(rpcTarget, accounts.value[0], to, amountSol);
    await signTransaction(transaction);
  } catch (err) {
    formError.value = err instanceof Error ? err.message : "Failed to sign transaction.";
  }
}
</script>

<template>
  <div>
    <h2>Sign Transaction</h2>
    <form @submit.prevent="submit">
      <input name="address" placeholder="Recipient address" required />
      <input name="value" placeholder="Amount (SOL)" type="number" step="0.01" min="0" required />
      <button type="submit" :disabled="isPending">
        {{ isPending ? "Signing..." : "Sign" }}
      </button>
    </form>
    <div v-if="signedTransaction" class="hash">Signed transaction: {{ signedTransaction }}</div>
    <div v-if="formError ?? error?.message" class="error">Error: {{ formError ?? error?.message }}</div>
  </div>
</template>

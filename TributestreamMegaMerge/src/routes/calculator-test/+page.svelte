<script lang="ts">
  import MemorialCalculator from '$lib/components/MemorialCalculator.svelte';
  import type { OrderData } from '$lib/types/memorial-calculator';

  function handleSave(data: OrderData) {
    console.log('Saving:', data);
    // Here you would typically save to your backend
  }

  function handleCheckout(data: OrderData) {
    console.log('Proceeding to checkout:', data);
    // Here you would typically redirect to checkout with the order data
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Memorial Service Calculator</h1>
  
  <div class="max-w-3xl mx-auto">
    <MemorialCalculator
      initialPackage="Solo"
      initialDuration={2}
      onSave={handleSave}
      onCheckout={handleCheckout}
    />
  </div>
</div>

<style>
  /* Additional styles if needed */
</style>
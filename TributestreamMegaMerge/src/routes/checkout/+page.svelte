<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { calculatorStore } from '$lib/stores/calculator';
  import PaymentForm from '$lib/components/checkout/PaymentForm.svelte';
  
  // Redirect if no package is selected
  onMount(() => {
    const unsubscribe = calculatorStore.subscribe(state => {
      if (!state.selectedPackage) {
        goto('/booking-calculator');
      }
    });
    
    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Checkout | Tributestream</title>
  <meta name="description" content="Complete your memorial service booking" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <h1 class="text-3xl font-bold text-center mb-2">Checkout</h1>
  <p class="text-center text-gray-600 mb-8">Complete your payment to finalize the memorial service booking</p>
  
  <PaymentForm />
</div>

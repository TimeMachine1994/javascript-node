<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { calculatorStore } from '$lib/stores/calculator';
  import { tributeDataStore } from '$lib/stores/tribute-data';
  import PaymentForm from '$lib/components/checkout/PaymentForm.svelte';
  import { Button } from '$lib/components/ui/button';
  
  // Data for the checkout page
  let isLoading = $state(true);
  let serviceDate = $state('');
  let serviceTime = $state('');
  let serviceLocation = $state('');
  let packageName = $state('');
  let packagePrice = $state(0);
  let additionalItems = $state<{name: string, price: number}[]>([]);
  let subtotal = $state(0);
  let tax = $state(0);
  let total = $state(0);
  let slug = $state('');
  
  // Check if data is available from calculator
  onMount(() => {
    // Get calculator data
    const unsubCalc = calculatorStore.subscribe(state => {
      if (state) {
        // Extract schedule info
        if (state.scheduleDetails) {
          serviceDate = state.scheduleDetails.date;
          serviceTime = state.scheduleDetails.time;
          
          if (state.scheduleDetails.location) {
            serviceLocation = state.scheduleDetails.location.name;
          }
        }
        
        // Extract pricing info
        subtotal = state.subtotal;
        tax = state.tax;
        total = state.total;
        
        // Get slug
        slug = state.slug || '';
        
        // Track whether checkout has valid data
        isLoading = !state.selectedPackage;
      }
    });
    unsubCalc();
    
    // Get tribute data for additional context
    const unsubTribute = tributeDataStore.subscribe(data => {
      if (data && data.package) {
        packageName = data.package.name;
        packagePrice = data.package.price;
      }
      
      if (data && data.additionalServices) {
        // Map selected additional services
        additionalItems = data.additionalServices
          .filter(service => service.selected)
          .map(service => ({
            name: service.name,
            price: service.price
          }));
      }
    });
    unsubTribute();
    
    // Redirect if no valid checkout data is available
    if (isLoading) {
      goto('/booking-calculator');
    }
  });
  
  // Handle back button
  function handleBack() {
    goto('/booking-calculator');
  }
</script>

<svelte:head>
  <title>Checkout | Tributestream</title>
  <meta name="description" content="Complete your memorial service booking" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <h1 class="text-3xl font-bold text-center mb-2">Checkout</h1>
  <p class="text-center text-gray-600 mb-8">Complete your payment to finalize the memorial service booking</p>
  
  {#if isLoading}
    <div class="text-center py-12">
      <div class="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
      <p>Loading checkout data...</p>
    </div>
  {:else}
    <!-- Order summary -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div class="divide-y">
        <!-- Service details -->
        <div class="py-4">
          <h3 class="font-medium mb-2">Service Details</h3>
          <p><span class="font-medium">Date:</span> {serviceDate || 'Not specified'}</p>
          <p><span class="font-medium">Time:</span> {serviceTime || 'Not specified'}</p>
          <p><span class="font-medium">Location:</span> {serviceLocation || 'Not specified'}</p>
        </div>
        
        <!-- Package details -->
        <div class="py-4">
          <h3 class="font-medium mb-2">Selected Package</h3>
          <div class="flex justify-between">
            <span>{packageName}</span>
            <span>${packagePrice.toFixed(2)}</span>
          </div>
        </div>
        
        <!-- Additional items -->
        {#if additionalItems.length > 0}
          <div class="py-4">
            <h3 class="font-medium mb-2">Additional Services</h3>
            {#each additionalItems as item}
              <div class="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            {/each}
          </div>
        {/if}
        
        <!-- Pricing -->
        <div class="py-4">
          <div class="flex justify-between mb-1">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex justify-between mb-1">
            <span>Tax (8.5%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div class="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Back button -->
    <div class="flex justify-center mb-8">
      <Button variant="outline" on:click={handleBack}>
        Back to Booking Calculator
      </Button>
    </div>
    
    <!-- Payment form -->
    <PaymentForm />
  {/if}
</div>

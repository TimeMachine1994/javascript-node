<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import type { CartItem } from '$lib/types/user-metadata';
  
  export let data: PageData;
  
  // Destructure calculator data with reactive statement
  $: ({
    cart: { items: cartItems, total: cartTotal },
    personalDetails
  } = data.calculatorData);

  // Form validation state
  let errors: Record<string, string> = {};
  let isProcessing = false;
  let paymentError = '';
  let cardNumber = '';
  let cardExpiry = '';
  let cardCvc = '';

  // Validate form fields
  function validateForm(): boolean {
    errors = {};
    
    if (!personalDetails.firstName) errors.firstName = 'First name is required';
    if (!personalDetails.lastName) errors.lastName = 'Last name is required';
    if (!personalDetails.email) errors.email = 'Email is required';
    if (!personalDetails.phone) errors.phone = 'Phone number is required';
    
    // Payment validation
    if (!cardNumber) errors.cardNumber = 'Card number is required';
    if (!cardExpiry) errors.cardExpiry = 'Expiry date is required';
    if (!cardCvc) errors.cardCvc = 'CVC is required';
    
    return Object.keys(errors).length === 0;
  }

  // Handle form submission
  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    isProcessing = true;
    paymentError = '';
    
    try {
      // TODO: Implement payment processing
      // For now, we'll just simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to confirmation page
      window.location.href = '/checkout/confirmation';
    } catch (error) {
      paymentError = error instanceof Error ? error.message : 'Payment processing failed';
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Checkout Form -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6">
          <i class="fas fa-heart mr-2"></i>
          Memorial Service Checkout
        </h1>

        <form on:submit={handleSubmit}>
          <!-- Personal Information -->
          <section class="mb-8">
            <h2 class="text-xl font-medium text-gray-700 mb-4">
              <i class="fas fa-user mr-2"></i>
              Personal Information
            </h2>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="First Name"
                    class="w-full p-3 border border-gray-300 rounded-lg {errors.firstName ? 'border-red-500' : ''}"
                    bind:value={personalDetails.firstName}
                  />
                  {#if errors.firstName}
                    <p class="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  {/if}
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Last Name"
                    class="w-full p-3 border border-gray-300 rounded-lg {errors.lastName ? 'border-red-500' : ''}"
                    bind:value={personalDetails.lastName}
                  />
                  {#if errors.lastName}
                    <p class="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  {/if}
                </div>
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  class="w-full p-3 border border-gray-300 rounded-lg {errors.email ? 'border-red-500' : ''}"
                  bind:value={personalDetails.email}
                />
                {#if errors.email}
                  <p class="text-red-500 text-sm mt-1">{errors.email}</p>
                {/if}
              </div>
              <div>
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  class="w-full p-3 border border-gray-300 rounded-lg {errors.phone ? 'border-red-500' : ''}"
                  bind:value={personalDetails.phone}
                />
                {#if errors.phone}
                  <p class="text-red-500 text-sm mt-1">{errors.phone}</p>
                {/if}
              </div>
            </div>
          </section>

          <!-- Payment Information -->
          <section class="mb-8">
            <h2 class="text-xl font-medium text-gray-700 mb-4">
              <i class="fas fa-credit-card mr-2"></i>
              Payment Details
            </h2>
            <div class="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Card Number"
                  class="w-full p-3 border border-gray-300 rounded-lg {errors.cardNumber ? 'border-red-500' : ''}"
                  bind:value={cardNumber}
                />
                {#if errors.cardNumber}
                  <p class="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                {/if}
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    class="w-full p-3 border border-gray-300 rounded-lg {errors.cardExpiry ? 'border-red-500' : ''}"
                    bind:value={cardExpiry}
                  />
                  {#if errors.cardExpiry}
                    <p class="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>
                  {/if}
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="CVC"
                    class="w-full p-3 border border-gray-300 rounded-lg {errors.cardCvc ? 'border-red-500' : ''}"
                    bind:value={cardCvc}
                  />
                  {#if errors.cardCvc}
                    <p class="text-red-500 text-sm mt-1">{errors.cardCvc}</p>
                  {/if}
                </div>
              </div>
            </div>
          </section>

          {#if paymentError}
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {paymentError}
            </div>
          {/if}

          <button 
            type="submit"
            class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isProcessing}
          >
            {#if isProcessing}
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Processing...
            {:else}
              <i class="fas fa-lock mr-2"></i>
              Complete Payment - ${cartTotal.toFixed(2)}
            {/if}
          </button>
        </form>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-lg shadow-lg p-6 h-fit">
        <h2 class="text-xl font-medium text-gray-700 mb-4">
          <i class="fas fa-clipboard-list mr-2"></i>
          Order Summary
        </h2>

        <div class="space-y-4">
          {#each cartItems as item}
            <div class="border-b pb-4">
              <div class="flex justify-between">
                <div>
                  <h3 class="font-medium">{item.name}</h3>
                </div>
                <p class="font-medium">${item.price.toFixed(2)}</p>
              </div>
            </div>
          {/each}

          <div class="flex justify-between pt-4">
            <span class="font-medium">Total</span>
            <span class="font-medium">${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</svelte:head>

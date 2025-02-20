<script lang="ts">
  import type { UserMetadata, ApiError } from '$lib/types/user-metadata';

  // Props passed from layout
  let { userData, userError, isLoading } = $props<{
    userData: UserMetadata | null;
    userError: ApiError | null;
    isLoading: boolean;
  }>();

  // Computed values for checkout
  let personalDetails = $derived(userData?.calculator_data?.personalDetails ?? null);
  let cartItems = $derived(userData?.calculator_data?.cartItems ?? []);
  let cartTotal = $derived(userData?.calculator_data?.cartTotal ?? 0);
  let selectedPackage = $derived(userData?.calculator_data?.selectedPackage ?? '');
  let memorialDetails = $derived(userData?.memorial_form_data?.memorial ?? null);

  // Validation state
  let hasRequiredData = $derived(
    !!personalDetails?.firstName &&
    !!personalDetails?.lastName &&
    !!personalDetails?.email &&
    cartItems.length > 0
  );

  // Handle checkout submission
  async function handleCheckout() {
    if (!hasRequiredData) {
      return;
    }
    // Checkout logic will be implemented here
  }
</script>

{#if !userData}
  <div class="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
    <div class="text-destructive">
      Please complete the memorial calculator before proceeding to checkout
    </div>
    <a 
      href="/calc" 
      class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
    >
      Go to Calculator
    </a>
  </div>
{:else}
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <h1 class="text-3xl font-bold">Checkout</h1>
    
    <!-- Personal Information -->
    <div class="bg-card p-6 rounded-lg shadow-sm">
      <h2 class="text-xl font-semibold mb-4">Personal Information</h2>
      {#if personalDetails}
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="font-medium">Name:</span>
            <span>{personalDetails.firstName} {personalDetails.lastName}</span>
          </div>
          <div>
            <span class="font-medium">Email:</span>
            <span>{personalDetails.email}</span>
          </div>
          <div>
            <span class="font-medium">Phone:</span>
            <span>{personalDetails.phone}</span>
          </div>
        </div>
      {:else}
        <div class="text-destructive">Personal information is incomplete</div>
      {/if}
    </div>

    <!-- Memorial Details -->
    {#if memorialDetails}
      <div class="bg-card p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Memorial Details</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="font-medium">Location:</span>
            <span>{memorialDetails.location}</span>
          </div>
          <div>
            <span class="font-medium">Date:</span>
            <span>{memorialDetails.date}</span>
          </div>
          <div>
            <span class="font-medium">Time:</span>
            <span>{memorialDetails.time}</span>
          </div>
        </div>
      </div>
    {/if}

    <!-- Order Summary -->
    <div class="bg-card p-6 rounded-lg shadow-sm">
      <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
      {#if cartItems.length > 0}
        <div class="space-y-4">
          <div class="divide-y">
            {#each cartItems as item}
              <div class="py-2 flex justify-between">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            {/each}
          </div>
          <div class="pt-4 border-t border-border">
            <div class="flex justify-between font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      {:else}
        <div class="text-destructive">No items in cart</div>
      {/if}
    </div>

    <!-- Checkout Button -->
    <div class="flex justify-end pt-6">
      <button
        class="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasRequiredData}
        on:click={handleCheckout}
      >
        Proceed to Payment
      </button>
    </div>
  </div>
{/if}
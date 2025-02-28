<script lang="ts">
  import { calculatorStore, PackageType, PACKAGE_INFO } from '$lib/stores/calculator';
  import { Button } from '$lib/components/ui/button';
  import { formatCurrency } from '$lib/utils/format';
  
  // Props
  let {
    onPayNow = () => {},
    onPayLater = () => {},
    showPaymentOptions = true,
    isCheckoutMode = false
  } = $props<{
    onPayNow?: () => void;
    onPayLater?: () => void;
    showPaymentOptions?: boolean;
    isCheckoutMode?: boolean;
  }>();
  
  // Local state derived from calculator store
  let selectedPackage = $state<PackageType | null>(null);
  let additionalServices = $state<any[]>([]);
  let subtotal = $state(0);
  let tax = $state(0);
  let total = $state(0);
  let discountAmount = $state<number | undefined>(undefined);
  let promoCode = $state<string | undefined>(undefined);
  let paymentMethod = $state<'credit_card' | 'invoice' | null | undefined>(null);
  
  // Reactive inputs
  let promoCodeInput = $state('');
  let isApplyingPromo = $state(false);
  let promoError = $state<string | null>(null);
  
  // Subscribe to calculator store
  calculatorStore.subscribe(state => {
    selectedPackage = state.selectedPackage;
    additionalServices = state.additionalServices;
    subtotal = state.subtotal;
    tax = state.tax;
    total = state.total;
    discountAmount = state.discountAmount;
    promoCode = state.promoCode;
    paymentMethod = state.paymentMethod;
  });
  
  // Handler for applying promo code
  function applyPromoCode() {
    if (!promoCodeInput.trim()) {
      promoError = 'Please enter a promo code';
      return;
    }
    
    isApplyingPromo = true;
    promoError = null;
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        calculatorStore.applyPromoCode(promoCodeInput);
        
        // Check if it worked
        if (!discountAmount) {
          promoError = 'Invalid promo code';
        }
      } catch (error) {
        console.error('Error applying promo code:', error);
        promoError = 'An error occurred while applying the promo code';
      } finally {
        isApplyingPromo = false;
      }
    }, 500);
  }
  
  // Handle payment method selection
  function selectPaymentMethod(method: 'credit_card' | 'invoice') {
    calculatorStore.setPaymentMethod(method);
  }
</script>

<div class="cart-summary border rounded-lg overflow-hidden bg-white">
  <!-- Header -->
  <div class="bg-gray-50 p-4 border-b">
    <h3 class="text-lg font-semibold">Order Summary</h3>
  </div>
  
  <!-- Cart Items -->
  <div class="p-4 divide-y">
    <!-- Selected Package -->
    {#if selectedPackage}
      <div class="py-3">
        <div class="flex justify-between">
          <span class="font-medium">{PACKAGE_INFO[selectedPackage].name}</span>
          <span>{formatCurrency(PACKAGE_INFO[selectedPackage].price)}</span>
        </div>
        <p class="text-sm text-gray-600 mt-1">{PACKAGE_INFO[selectedPackage].description}</p>
      </div>
    {:else}
      <div class="py-3 text-gray-500 italic">
        No package selected
      </div>
    {/if}
    
    <!-- Additional Services -->
    {#if additionalServices.some(service => service.isSelected)}
      <div class="py-3">
        <h4 class="font-medium mb-2">Additional Services</h4>
        {#each additionalServices.filter(service => service.isSelected) as service}
          <div class="flex justify-between text-sm mb-2">
            <span>{service.name}</span>
            <span>{formatCurrency(service.price)}</span>
          </div>
        {/each}
      </div>
    {/if}
    
    <!-- Promo Code Section -->
    <div class="py-3">
      {#if promoCode && discountAmount}
        <div class="flex justify-between mb-2">
          <span class="text-green-600">
            Promo: {promoCode.toUpperCase()}
          </span>
          <span class="text-green-600">-{formatCurrency(discountAmount)}</span>
        </div>
      {:else}
        <div class="flex space-x-2 mb-2">
          <input 
            type="text" 
            placeholder="Promo code" 
            class="flex-1 px-3 py-1 border rounded-md text-sm"
            bind:value={promoCodeInput}
          />
          <Button 
            variant="outline"
            size="sm"
            on:click={applyPromoCode}
            disabled={isApplyingPromo || !promoCodeInput.trim()}
          >
            {isApplyingPromo ? 'Applying...' : 'Apply'}
          </Button>
        </div>
        
        {#if promoError}
          <p class="text-red-600 text-xs">{promoError}</p>
        {/if}
      {/if}
    </div>
    
    <!-- Price Summary -->
    <div class="py-3 space-y-2">
      <div class="flex justify-between">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div class="flex justify-between">
        <span>Tax (8.5%)</span>
        <span>{formatCurrency(tax)}</span>
      </div>
      {#if discountAmount}
        <div class="flex justify-between">
          <span>Discount</span>
          <span>-{formatCurrency(discountAmount)}</span>
        </div>
      {/if}
      <div class="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  </div>
  
  <!-- Payment Options -->
  {#if showPaymentOptions}
    <div class="p-4 bg-gray-50 border-t">
      <h4 class="font-medium mb-3">Payment Options</h4>
      <div class="grid gap-3">
        {#if isCheckoutMode}
          <div class="grid grid-cols-2 gap-3">
            <div 
              class={`border rounded-md p-3 text-center cursor-pointer transition-all ${paymentMethod === 'credit_card' ? 'border-primary bg-primary/10' : 'border-gray-300'}`}
              on:click={() => selectPaymentMethod('credit_card')}
              on:keydown={(e) => e.key === 'Enter' && selectPaymentMethod('credit_card')}
              tabindex="0"
            >
              <span class="font-medium">Credit Card</span>
            </div>
            <div 
              class={`border rounded-md p-3 text-center cursor-pointer transition-all ${paymentMethod === 'invoice' ? 'border-primary bg-primary/10' : 'border-gray-300'}`}
              on:click={() => selectPaymentMethod('invoice')}
              on:keydown={(e) => e.key === 'Enter' && selectPaymentMethod('invoice')}
              tabindex="0"
            >
              <span class="font-medium">Invoice</span>
            </div>
          </div>
          
          {#if paymentMethod}
            <Button variant="gold" class="w-full mt-3">
              Complete Payment
            </Button>
          {/if}
        {:else}
          <Button 
            variant="gold" 
            class="w-full"
            disabled={!selectedPackage}
            on:click={onPayNow}
          >
            Save & Pay Now
          </Button>
          <Button 
            variant="outline" 
            class="w-full"
            disabled={!selectedPackage}
            on:click={onPayLater}
          >
            Save & Pay Later
          </Button>
        {/if}
      </div>
    </div>
  {/if}
</div>
<script lang="ts">
  import { goto } from '$app/navigation';
  import { calculatorStore, PackageType, PACKAGE_INFO } from '$lib/stores/calculator';
  import { formatCurrency } from '$lib/utils/format';
  import FormField from '$lib/components/forms/FormField.svelte';
  import { Button } from '$lib/components/ui/button';
  
  // Form state
  let formState = $state('editing'); // editing, processing, success, error
  let error = $state<string | null>(null);
  
  // Payment details
  let cardNumber = $state('');
  let cardName = $state('');
  let expiryDate = $state('');
  let cvv = $state('');
  
  // Billing address
  let addressLine1 = $state('');
  let addressLine2 = $state('');
  let city = $state('');
  let state = $state('');
  let zipCode = $state('');
  let country = $state('United States');
  
  // Order summary from calculator store
  let selectedPackage = $state<PackageType | null>(null);
  let additionalServices = $state<any[]>([]);
  let subtotal = $state(0);
  let tax = $state(0);
  let total = $state(0);
  let discountAmount = $state<number | undefined>(undefined);
  let slug = $state<string | undefined>(undefined);
  
  // Subscribe to calculator store
  calculatorStore.subscribe(calcState => {
    selectedPackage = calcState.selectedPackage;
    additionalServices = calcState.additionalServices;
    subtotal = calcState.subtotal;
    tax = calcState.tax;
    total = calcState.total;
    discountAmount = calcState.discountAmount;
    slug = calcState.slug;
  });
  
  // Form validation functions
  function validateCardNumber(): boolean {
    if (!cardNumber.trim()) {
      error = 'Please enter a card number';
      return false;
    }
    
    // Simple validation for demo purposes
    const digitsOnly = cardNumber.replace(/\D/g, '');
    if (digitsOnly.length < 13 || digitsOnly.length > 19) {
      error = 'Card number should be between 13 and 19 digits';
      return false;
    }
    
    return true;
  }
  
  function validateCardName(): boolean {
    if (!cardName.trim()) {
      error = 'Please enter the name on the card';
      return false;
    }
    return true;
  }
  
  function validateExpiryDate(): boolean {
    if (!expiryDate.trim()) {
      error = 'Please enter expiry date';
      return false;
    }
    
    // Validate MM/YY format
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiryDate)) {
      error = 'Expiry date should be in MM/YY format';
      return false;
    }
    
    // Validate expiry date is not in the past
    const [month, year] = expiryDate.split('/').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      error = 'Card has expired';
      return false;
    }
    
    return true;
  }
  
  function validateCVV(): boolean {
    if (!cvv.trim()) {
      error = 'Please enter CVV';
      return false;
    }
    
    const digitsOnly = cvv.replace(/\D/g, '');
    if (digitsOnly.length < 3 || digitsOnly.length > 4) {
      error = 'CVV should be 3 or 4 digits';
      return false;
    }
    
    return true;
  }
  
  function validateBillingAddress(): boolean {
    if (!addressLine1.trim()) {
      error = 'Please enter your billing address';
      return false;
    }
    
    if (!city.trim()) {
      error = 'Please enter your city';
      return false;
    }
    
    if (!state.trim()) {
      error = 'Please enter your state';
      return false;
    }
    
    if (!zipCode.trim()) {
      error = 'Please enter your zip code';
      return false;
    }
    
    return true;
  }
  
  // Validate entire form
  function validateForm(): boolean {
    error = null;
    
    return (
      validateCardNumber() &&
      validateCardName() &&
      validateExpiryDate() &&
      validateCVV() &&
      validateBillingAddress()
    );
  }
  
  // Format card number as user types
  function formatCardNumber(e: Event) {
    const target = e.target as HTMLInputElement;
    let value = target.value.replace(/\D/g, '');
    let formatted = '';
    
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += value[i];
    }
    
    cardNumber = formatted;
  }
  
  // Format expiry date as user types
  function formatExpiryDate(e: Event) {
    const target = e.target as HTMLInputElement;
    let value = target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      expiryDate = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    } else {
      expiryDate = value;
    }
  }
  
  // Submit form
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    formState = 'processing';
    
    try {
      // In a real implementation, we would make an API call to process the payment
      // For demo purposes, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      formState = 'success';
    } catch (err) {
      console.error('Payment processing error:', err);
      formState = 'error';
      error = 'An error occurred while processing your payment. Please try again.';
    }
  }
  
  // Continue to confirmation page after successful payment
  function handleContinue() {
    goto(`/celebration-of-life-for-${slug}`);
  }
</script>

<div class="payment-form">
  {#if formState === 'editing' || formState === 'error'}
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Payment form (left 3/5 on desktop) -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold mb-6">Payment Details</h2>
          
          {#if error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
              <p>{error}</p>
            </div>
          {/if}
          
          <form on:submit={handleSubmit} class="space-y-6">
            <!-- Card details -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium">Card Information</h3>
              
              <FormField
                name="cardNumber"
                label="Card Number"
                value={cardNumber}
                placeholder="1234 5678 9012 3456"
                on:input={formatCardNumber}
                required={true}
              />
              
              <FormField
                name="cardName"
                label="Name on Card"
                value={cardName}
                placeholder="John Smith"
                on:input={(e) => cardName = (e.currentTarget as HTMLInputElement)?.value || ''}
                required={true}
              />
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="expiryDate"
                  label="Expiry Date (MM/YY)"
                  value={expiryDate}
                  placeholder="MM/YY"
                  on:input={formatExpiryDate}
                  required={true}
                />
                
                <FormField
                  name="cvv"
                  label="CVV"
                  value={cvv}
                  placeholder="123"
                  on:input={(e) => cvv = (e.currentTarget as HTMLInputElement)?.value || ''}
                  required={true}
                />
              </div>
            </div>
            
            <!-- Billing Address -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium">Billing Address</h3>
              
              <FormField
                name="addressLine1"
                label="Address Line 1"
                value={addressLine1}
                placeholder="123 Main St"
                on:input={(e) => addressLine1 = (e.currentTarget as HTMLInputElement)?.value || ''}
                required={true}
              />
              
              <FormField
                name="addressLine2"
                label="Address Line 2 (Optional)"
                value={addressLine2}
                placeholder="Apt, Suite, etc."
                on:input={(e) => addressLine2 = (e.currentTarget as HTMLInputElement)?.value || ''}
              />
              
              <div class="grid grid-cols-2 gap-4">
                <FormField
                  name="city"
                  label="City"
                  value={city}
                  placeholder="New York"
                  on:input={(e) => city = (e.currentTarget as HTMLInputElement)?.value || ''}
                  required={true}
                />
                
                <FormField
                  name="state"
                  label="State"
                  value={state}
                  placeholder="NY"
                  on:input={(e) => state = (e.currentTarget as HTMLInputElement)?.value || ''}
                  required={true}
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <FormField
                  name="zipCode"
                  label="Zip Code"
                  value={zipCode}
                  placeholder="10001"
                  on:input={(e) => zipCode = (e.currentTarget as HTMLInputElement)?.value || ''}
                  required={true}
                />
                
                <FormField
                  name="country"
                  label="Country"
                  value={country}
                  placeholder="Country"
                  on:input={(e) => country = (e.currentTarget as HTMLInputElement)?.value || ''}
                  required={true}
                />
              </div>
            </div>
            
            <Button 
              type="submit"
              variant="gold"
              class="w-full py-3 text-lg"
              disabled={formState === 'processing'}
            >
              {formState === 'processing' ? 'Processing...' : `Pay ${formatCurrency(total)}`}
            </Button>
          </form>
        </div>
      </div>
      
      <!-- Order summary (right 2/5 on desktop) -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-gray-50 p-4 border-b">
            <h3 class="text-lg font-semibold">Order Summary</h3>
          </div>
          
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
        </div>
      </div>
    </div>
  {:else if formState === 'processing'}
    <!-- Processing state -->
    <div class="bg-white rounded-lg shadow-lg p-12 text-center">
      <div class="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
      <h2 class="text-2xl font-bold mb-4">Processing Your Payment</h2>
      <p class="text-gray-600">Please wait while we process your payment. This may take a few moments.</p>
    </div>
  {:else if formState === 'success'}
    <!-- Success state -->
    <div class="bg-white rounded-lg shadow-lg p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold mb-4">Payment Successful!</h2>
      <p class="text-gray-600 mb-8">
        Thank you for your payment. Your memorial service has been scheduled successfully.
      </p>
      <Button 
        variant="gold"
        on:click={handleContinue}
      >
        View Your Tribute Page
      </Button>
    </div>
  {/if}
</div>
<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import FormField from '$lib/components/forms/FormField.svelte';
  import { tributeDataStore } from '$lib/stores/tribute-data';
  import { validateRequired, validateCardNumber, validateExpiryDate, validateCVV } from '$lib/utils/validators';
  
  // Form state
  let cardholderName = $state('');
  let cardNumber = $state('');
  let expiryDate = $state('');
  let cvv = $state('');
  let isSubmitting = $state(false);
  let formError = $state<string | null>(null);
  let paymentSuccess = $state(false);
  
  // Handle form submission
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    
    // Validate payment form
    const validators = {
      cardholderName: (value: string) => validateRequired(value, 'Cardholder name'),
      cardNumber: validateCardNumber,
      expiryDate: validateExpiryDate,
      cvv: validateCVV
    };
    
    // Perform validation
    if (!validators.cardholderName(cardholderName)) {
      formError = 'Please enter the cardholder name';
      return;
    }
    
    if (!validators.cardNumber(cardNumber)) {
      formError = 'Please enter a valid card number';
      return;
    }
    
    if (!validators.expiryDate(expiryDate)) {
      formError = 'Please enter a valid expiry date (MM/YY)';
      return;
    }
    
    if (!validators.cvv(cvv)) {
      formError = 'Please enter a valid CVV code';
      return;
    }
    
    formError = null;
    isSubmitting = true;
    
    try {
      // In a real app, this would be a call to a payment processor API
      // For this MVP, we'll just simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status in tribute data store
      tributeDataStore.updatePayment({
        status: 'completed'
      });
      
      // Show success message
      paymentSuccess = true;
      
      // Wait briefly before redirecting
      setTimeout(() => {
        // Extract slug for redirection to tribute page
        let slug = '';
        const unsubscribe = tributeDataStore.subscribe(data => {
          slug = data.tributePage.slug || '';
        });
        unsubscribe();
        
        // Redirect to tribute page or confirmation
        if (slug) {
          goto(`/celebration-of-life-for-${slug}`);
        } else {
          goto('/');
        }
      }, 2000);
    } catch (error) {
      console.error('Payment processing error:', error);
      formError = 'An error occurred while processing your payment. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
  
  // Format card number as user types (add spaces every 4 digits)
  function formatCardNumber(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const value = input.value.replace(/\D/g, ''); // Remove non-digits
    const chunks = [];
    
    // Split into chunks of 4
    for (let i = 0; i < value.length; i += 4) {
      chunks.push(value.substring(i, i + 4));
    }
    
    cardNumber = chunks.join(' ').trim();
  }
  
  // Format expiry date as user types (add slash between month and year)
  function formatExpiryDate(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    
    if (value.length > 2) {
      expiryDate = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    } else {
      expiryDate = value;
    }
  }
</script>

<div class="bg-white rounded-lg shadow-lg p-6">
  <h2 class="text-xl font-semibold mb-4">Payment Information</h2>
  
  {#if formError}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
      <p>{formError}</p>
    </div>
  {/if}
  
  {#if paymentSuccess}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6" role="alert">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <p>Payment successful! Redirecting...</p>
      </div>
    </div>
  {/if}
  
  <form on:submit={handleSubmit} class="space-y-4">
    <FormField
      name="cardholderName"
      label="Cardholder Name"
      type="text"
      required={true}
      value={cardholderName}
      on:input={(e) => cardholderName = (e.currentTarget as HTMLInputElement)?.value || ''}
      placeholder="John Smith"
    />
    
    <FormField
      name="cardNumber"
      label="Card Number"
      type="text"
      required={true}
      value={cardNumber}
      on:input={formatCardNumber}
      placeholder="1234 5678 9012 3456"
      maxlength="19" 
    />
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        name="expiryDate"
        label="Expiry Date"
        type="text"
        required={true}
        value={expiryDate}
        on:input={formatExpiryDate}
        placeholder="MM/YY"
        maxlength="5"
      />
      
      <FormField
        name="cvv"
        label="CVV"
        type="text"
        required={true}
        value={cvv}
        on:input={(e) => cvv = (e.currentTarget as HTMLInputElement)?.value || ''}
        placeholder="123"
        maxlength="4"
      />
    </div>
    
    <div class="mt-6">
      <Button
        type="submit"
        variant="gold"
        class="w-full py-3 text-lg font-medium"
        disabled={isSubmitting || paymentSuccess}
      >
        {isSubmitting ? 'Processing Payment...' : 'Pay Now'}
      </Button>
    </div>
  </form>
  
  <div class="mt-6 text-center text-sm text-gray-500">
    <p>Your payment information is secure and encrypted.</p>
    <p class="mt-1">This is a demonstration only - no actual payment will be processed.</p>
  </div>
</div>
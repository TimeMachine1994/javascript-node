<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import FormField from '$lib/components/forms/FormField.svelte';
  import { slugify } from '$lib/utils/slugify';
  import { validateRequired, validateEmail, validatePhone, validateObject } from '$lib/utils/validators';
  import { tributeDataStore } from '$lib/stores/tribute-data';
  
  // Component state
  let formState = $state('editing'); // editing, generating, success
  let isSubmitting = $state(false);
  let formError = $state<string | null>(null);
  let generatedLink = $state('');
  
  // Form fields
  // Deceased information
  let deceasedFullName = $state('');
  let dateOfBirth = $state('');
  let dateOfPassing = $state('');
  
  // Service details
  let serviceDate = $state('');
  let serviceTime = $state('');
  let serviceLocation = $state('');
  let serviceAddress = $state('');
  let serviceCity = $state('');
  let serviceState = $state('');
  let serviceZipCode = $state('');
  let serviceDuration = $state(2); // Default 2 hours
  
  // Funeral director information
  let directorName = $state('');
  let funeralHome = $state('');
  let directorEmail = $state('');
  let directorPhone = $state('');
  
  // Payment choice
  let paymentChoice = $state<'now' | 'later' | null>(null);
  
  // Derived values
  let slugifiedName = $derived(slugify(deceasedFullName));
  let customLink = $derived(`http://www.tributestream.com/celebration-of-life-for-${slugifiedName}`);
  
  // Form validation
  let isFormValid = $derived(
    !!deceasedFullName.trim() &&
    !!dateOfPassing.trim() &&
    !!serviceDate.trim() &&
    !!serviceTime.trim() &&
    !!serviceLocation.trim() &&
    !!serviceAddress.trim() &&
    !!serviceCity.trim() &&
    !!serviceState.trim() &&
    !!serviceZipCode.trim() &&
    !!directorName.trim() &&
    !!funeralHome.trim() &&
    !!directorEmail.trim() &&
    !!directorPhone.trim() &&
    paymentChoice !== null
  );
  
  // Handle form submission
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    
    // Validate form
    const validators = {
      deceasedFullName: (value: string) => validateRequired(value, "Deceased's full name"),
      dateOfPassing: (value: string) => validateRequired(value, "Date of passing"),
      serviceDate: (value: string) => validateRequired(value, "Service date"),
      serviceTime: (value: string) => validateRequired(value, "Service time"),
      serviceLocation: (value: string) => validateRequired(value, "Service location"),
      serviceAddress: (value: string) => validateRequired(value, "Service address"),
      serviceCity: (value: string) => validateRequired(value, "Service city"),
      serviceState: (value: string) => validateRequired(value, "Service state"),
      serviceZipCode: (value: string) => validateRequired(value, "Service zip code"),
      directorName: (value: string) => validateRequired(value, "Your name"),
      funeralHome: (value: string) => validateRequired(value, "Funeral home"),
      directorEmail: validateEmail,
      directorPhone: validatePhone
    };
    
    const validation = validateObject(
      { 
        deceasedFullName, 
        dateOfPassing, 
        serviceDate, 
        serviceTime, 
        serviceLocation, 
        serviceAddress, 
        serviceCity, 
        serviceState, 
        serviceZipCode, 
        directorName, 
        funeralHome, 
        directorEmail, 
        directorPhone 
      },
      validators
    );
    
    if (!validation.valid) {
      formError = Object.values(validation.errors)[0] || 'Please fill out all required fields correctly';
      return;
    }
    
    if (paymentChoice === null) {
      formError = 'Please select a payment option';
      return;
    }
    
    isSubmitting = true;
    formError = null;
    
    try {
      // Change state to generating link
      formState = 'generating';
      
      // Convert payment choice to the format expected by the store
      const storePaymentMethod = paymentChoice === 'now' ? 'credit_card' :
                                paymentChoice === 'later' ? 'invoice' : null;
                                
      // Save data to the tribute data store for cross-component data sharing
      tributeDataStore.importFromFDForm({
        deceasedName: deceasedFullName,
        dateOfBirth,
        dateOfPassing,
        serviceDate,
        serviceTime,
        serviceLocation,
        serviceAddress,
        serviceCity,
        serviceState,
        serviceZipCode,
        serviceDuration,
        directorName,
        funeralHome,
        directorEmail,
        directorPhone,
        paymentChoice: storePaymentMethod
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the slug from the tribute data store
      const slug = tributeDataStore.getSlug();
      
      // Save generated link
      generatedLink = `http://www.tributestream.com/celebration-of-life-for-${slug}`;
      
      // Update state to success
      formState = 'success';
    } catch (error) {
      console.error('Form submission error:', error);
      formError = 'An error occurred while processing your request. Please try again.';
      formState = 'editing';
    } finally {
      isSubmitting = false;
    }
  }
  
  // Handle payment choice selection
  function handlePaymentChoice(choice: 'now' | 'later') {
    paymentChoice = choice;
  }
  
  // Handle proceeding to next step based on payment choice
  function handleProceedToNextStep() {
    // Get the slug from the tribute data store
    const slug = tributeDataStore.getSlug();
    
    if (paymentChoice === 'now') {
      goto('/booking-calculator?source=fd-form&tributeId=new&slug=' + slug);
    } else {
      goto('/fd-form/confirmation?slug=' + slug);
    }
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <h1 class="text-3xl font-bold text-center mb-8">Funeral Director Tribute Submission</h1>
  
  {#if formError}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
      <p>{formError}</p>
    </div>
  {/if}
  
  {#if formState === 'editing'}
    <form on:submit={handleSubmit} class="space-y-8">
      <!-- Deceased Information Section -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Deceased Information</h2>
        
        <FormField
          name="deceasedFullName"
          label="Full Name"
          type="text"
          required={true}
          value={deceasedFullName}
          on:input={(e) => deceasedFullName = (e.currentTarget as HTMLInputElement)?.value || ''}
        />
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            on:input={(e) => dateOfBirth = (e.currentTarget as HTMLInputElement)?.value || ''}
          />
          
          <FormField
            name="dateOfPassing"
            label="Date of Passing"
            type="date"
            required={true}
            value={dateOfPassing}
            on:input={(e) => dateOfPassing = (e.currentTarget as HTMLInputElement)?.value || ''}
          />
        </div>
      </section>
      
      <!-- Service Details Section -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Service Details</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="serviceDate"
            label="Service Date"
            type="date"
            required={true}
            value={serviceDate}
            on:input={(e) => serviceDate = (e.currentTarget as HTMLInputElement)?.value || ''}
          />
          
          <FormField
            name="serviceTime"
            label="Service Time"
            type="time"
            required={true}
            value={serviceTime}
            on:input={(e) => serviceTime = (e.currentTarget as HTMLInputElement)?.value || ''}
          />
        </div>
        
        <FormField
          name="serviceLocation"
          label="Location Name"
          type="text"
          required={true}
          value={serviceLocation}
          on:input={(e) => serviceLocation = (e.currentTarget as HTMLInputElement)?.value || ''}
        />
        
        <FormField
          name="serviceAddress"
          label="Address"
          type="text"
          required={true}
          value={serviceAddress}
          on:input={(e) => serviceAddress = (e.currentTarget as HTMLInputElement)?.value || ''}
        />
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            name="serviceCity"
            label="City"
            type="text"
            required={true}
            value={serviceCity}
            on:input={(e) => serviceCity = (e.currentTarget as HTMLInputElement)?.value || ''}
          />
          
          <FormField
            name="serviceState"
            label="State"
            type="text"
            required={true}
            value={serviceState}
            on:input={(e) => serviceState = (e.currentTarget as HTMLInputElement)?.value || ''}
          />
          
          <FormField
            name="serviceZipCode"
            label="Zip Code"
            type="text"
            required={true}
            value={serviceZipCode}
            on:input={(e) => serviceZipCode = (e.currentTarget as HTMLInputElement)?.value || ''}
          />
        </div>
        
        <div>
          <label for="serviceDuration" class="block text-sm font-medium text-gray-700 mb-1">
            Service Duration (Hours)
          </label>
          <select 
            id="serviceDuration" 
            name="serviceDuration"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            bind:value={serviceDuration}
          >
            <option value={1}>1 Hour</option>
            <option value={2}>2 Hours</option>
            <option value={3}>3 Hours</option>
            <option value={4}>4 Hours</option>
            <option value={5}>5 Hours</option>
          </select>
        </div>
      </section>
      
      <!-- Funeral Director Information Section -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Funeral Director Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="directorName"
            label="Your Name"
            type="text"
            required={true}
            value={directorName}
            on:input={(e) => directorName = (e.currentTarget as HTMLInputElement)?.value || ''}
          />
          
          <FormField
            name="funeralHome"
            label="Funeral Home"
            type="text"
            required={true}
            value={funeralHome}
            on:input={(e) => funeralHome = (e.currentTarget as HTMLInputElement)?.value || ''}
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="directorEmail"
            label="Email"
            type="email"
            required={true}
            value={directorEmail}
            on:input={(e) => directorEmail = (e.currentTarget as HTMLInputElement)?.value || ''}
          />
          
          <FormField
            name="directorPhone"
            label="Phone"
            type="tel"
            required={true}
            value={directorPhone}
            on:input={(e) => directorPhone = (e.currentTarget as HTMLInputElement)?.value || ''}
          />
        </div>
      </section>
      
      <!-- Payment Options Section -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Payment Options</h2>
        
        <div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-center">
          <button
            type="button"
            class={`border-2 p-4 rounded-lg flex-1 text-center transition-all ${paymentChoice === 'now' ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-gray-400'}`}
            on:click={() => handlePaymentChoice('now')}
          >
            <h3 class="text-xl font-bold mb-2">Pay Now</h3>
            <p class="text-gray-600">Process payment immediately</p>
          </button>
          
          <button
            type="button"
            class={`border-2 p-4 rounded-lg flex-1 text-center transition-all ${paymentChoice === 'later' ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-gray-400'}`}
            on:click={() => handlePaymentChoice('later')}
          >
            <h3 class="text-xl font-bold mb-2">Pay Later</h3>
            <p class="text-gray-600">Send invoice to family</p>
          </button>
        </div>
      </section>
      
      <!-- Custom URL Preview -->
      <section class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-lg font-medium">Custom Tribute Link Preview:</h3>
        <p class="font-mono break-all">{customLink}</p>
        <p class="text-sm text-gray-600 mt-2">This is the link that will be created for the tribute page.</p>
      </section>
      
      <!-- Submit Button -->
      <div class="flex justify-center">
        <Button
          type="submit"
          variant="gold"
          disabled={isSubmitting || !isFormValid}
          class="px-8 py-3 text-lg"
        >
          {isSubmitting ? 'Submitting...' : 'Generate Tribute Link'}
        </Button>
      </div>
    </form>
  
  {:else if formState === 'generating'}
    <!-- Loading state -->
    <div class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin h-16 w-16 border-4 border-primary rounded-full border-t-transparent mb-4"></div>
      <h2 class="text-2xl font-bold">Generating Tribute Link</h2>
      <p class="text-center mt-4">Please wait while we create the tribute page...</p>
    </div>
  
  {:else if formState === 'success'}
    <!-- Success state -->
    <div class="text-center py-8 space-y-6">
      <div class="bg-green-100 text-green-800 p-4 rounded-lg inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-xl font-semibold">Tribute Link Generated!</span>
      </div>
      
      <div class="mt-8">
        <h3 class="text-lg font-medium mb-2">Custom Tribute Link:</h3>
        <div class="bg-gray-100 p-4 rounded-lg break-all font-mono">
          {generatedLink}
        </div>
      </div>
      
      <div class="mt-8">
        <h3 class="text-xl font-semibold mb-4">Payment Option Selected: {paymentChoice === 'now' ? 'Pay Now' : 'Pay Later'}</h3>
        
        <Button 
          variant="gold"
          class="px-8 py-3 text-lg"
          on:click={handleProceedToNextStep}
        >
          {paymentChoice === 'now' ? 'Proceed to Payment' : 'Continue to Confirmation'}
        </Button>
      </div>
    </div>
  {/if}
</div>
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { calculatorStore, ADDITIONAL_SERVICES } from '$lib/stores/calculator';
  import PackageSelector from './PackageSelector.svelte';
  import ScheduleDay from './ScheduleDay.svelte';
  import LocationForm from './LocationForm.svelte';
  import CartSummary from './CartSummary.svelte';
  import { Button } from '$lib/components/ui/button';
  
  // Component props
  let {
    tributeId = '',
    slug = '',
    source = ''
  } = $props<{
    tributeId?: string;
    slug?: string;
    source?: string;
  }>();
  
  // Component state
  let step = $state(1);
  let totalSteps = $state(3);
  let isSubmitting = $state(false);
  let error = $state<string | null>(null);
  
  // Calculator store state
  let isPackageSelected = $state(false);
  let isDateSelected = $state(false);
  let isLocationSet = $state(false);
  
  // Subscribe to calculator store
  calculatorStore.subscribe(state => {
    isPackageSelected = !!state.selectedPackage;
    isDateSelected = !!state.scheduleDetails.date && !!state.scheduleDetails.time;
    isLocationSet = !!state.scheduleDetails.location;
  });
  
  // Initialize calculator with any provided parameters
  onMount(() => {
    // Reset calculator store
    calculatorStore.reset(tributeId, slug);
    
    // Set initial step based on parameters (e.g., fd-form might skip to package selection)
    if (source === 'fd-form') {
      step = 2; // Skip to package selection
    }
  });
  
  // Next step navigation
  function goToNextStep() {
    if (step < totalSteps) {
      step++;
    }
  }
  
  // Previous step navigation
  function goToPreviousStep() {
    if (step > 1) {
      step--;
    }
  }
  
  // Check if the current step is complete and we can proceed
  function canProceedFromCurrentStep(): boolean {
    switch (step) {
      case 1: // Schedule and Location
        return isDateSelected && isLocationSet;
      case 2: // Package Selection
        return isPackageSelected;
      default:
        return true;
    }
  }
  
  // Handle payment options
  function handlePayNow() {
    if (!canProceedFromCurrentStep()) {
      error = 'Please complete all required fields';
      return;
    }
    
    calculatorStore.setPaymentMethod('credit_card');
    goto('/checkout');
  }
  
  function handlePayLater() {
    if (!canProceedFromCurrentStep()) {
      error = 'Please complete all required fields';
      return;
    }
    
    calculatorStore.setPaymentMethod('invoice');
    
    // Simulate submission
    isSubmitting = true;
    setTimeout(() => {
      isSubmitting = false;
      // Redirect to confirmation page
      goto(`/booking-calculator/confirmation?slug=${slug || ''}`);
    }, 1000);
  }
</script>

<div class="booking-calculator container mx-auto px-4 py-8 max-w-6xl">
  <h1 class="text-3xl font-bold text-center mb-2">Memorial Service Booking</h1>
  <p class="text-center text-gray-600 mb-8">Schedule and select options for the memorial service</p>
  
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
      <p>{error}</p>
    </div>
  {/if}
  
  <!-- Progress steps -->
  <div class="flex items-center justify-between mb-8 max-w-2xl mx-auto">
    {#each Array(totalSteps) as _, i}
      <div class="flex items-center">
        <div 
          class={`rounded-full h-10 w-10 flex items-center justify-center border-2 
          ${step > i ? 'bg-primary border-primary text-white' : 
            step === i + 1 ? 'border-primary text-primary' : 'border-gray-300 text-gray-400'}`}
        >
          {i + 1}
        </div>
        <div class="ml-2 text-sm hidden md:block">
          {i === 0 ? 'Schedule & Location' : 
           i === 1 ? 'Select Package' : 
           'Additional Options'}
        </div>
      </div>
      
      {#if i < totalSteps - 1}
        <div class={`flex-1 h-1 mx-2 ${step > i + 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
      {/if}
    {/each}
  </div>
  
  <!-- Step content -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main content (left 2/3 on desktop) -->
    <div class="lg:col-span-2 space-y-8">
      {#if step === 1}
        <!-- Step 1: Schedule and Location -->
        <div class="bg-white rounded-lg p-6 shadow">
          <ScheduleDay />
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow">
          <LocationForm />
        </div>
        
        <div class="flex justify-between">
          <Button variant="outline" disabled={true}>
            Back
          </Button>
          <Button 
            variant="gold"
            disabled={!isDateSelected || !isLocationSet} 
            on:click={goToNextStep}
          >
            Continue to Packages
          </Button>
        </div>
        
      {:else if step === 2}
        <!-- Step 2: Package Selection -->
        <div class="bg-white rounded-lg p-6 shadow">
          <PackageSelector />
        </div>
        
        <div class="flex justify-between">
          <Button variant="outline" on:click={goToPreviousStep}>
            Back
          </Button>
          <Button 
            variant="gold"
            disabled={!isPackageSelected} 
            on:click={goToNextStep}
          >
            Continue to Options
          </Button>
        </div>
        
      {:else if step === 3}
        <!-- Step 3: Additional Options -->
        <div class="bg-white rounded-lg p-6 shadow">
          <h2 class="text-2xl font-semibold mb-6">Additional Options</h2>
          
          <div class="space-y-4">
            {#each [...ADDITIONAL_SERVICES] as service}
              <div 
                class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                on:click={() => calculatorStore.toggleAdditionalService(service.id)}
                on:keydown={(e) => e.key === 'Enter' && calculatorStore.toggleAdditionalService(service.id)}
                tabindex="0"
              >
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <input 
                      type="checkbox" 
                      id={service.id} 
                      checked={service.isSelected} 
                      class="h-5 w-5 text-primary" 
                    />
                  </div>
                  <div class="ml-3">
                    <label for={service.id} class="font-medium">{service.name}</label>
                    <p class="text-gray-600">{service.description}</p>
                    <p class="text-gray-800 font-medium mt-1">${service.price}</p>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
        
        <div class="flex justify-between">
          <Button variant="outline" on:click={goToPreviousStep}>
            Back
          </Button>
        </div>
      {/if}
    </div>
    
    <!-- Order summary (right 1/3 on desktop) -->
    <div class="lg:col-span-1">
      <CartSummary 
        onPayNow={handlePayNow}
        onPayLater={handlePayLater}
      />
    </div>
  </div>
</div>
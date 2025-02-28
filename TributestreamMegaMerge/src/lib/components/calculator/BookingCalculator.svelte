<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { calculatorStore, ADDITIONAL_SERVICES, PackageType, PACKAGE_INFO, type CalculatorState } from '$lib/stores/calculator';
  import { tributeDataStore } from '$lib/stores/tribute-data';
  import type { TributeData } from '$lib/stores/tribute-data';
  import PackageSelector from './PackageSelector.svelte';
  import ScheduleDay from './ScheduleDay.svelte';
  import CartSummary from './CartSummary.svelte';
  import { Button } from '$lib/components/ui/button';
  import FormField from '$lib/components/forms/FormField.svelte';

  // Component props
  let {
    tributeId = '',
    slug = '',
    source = '',
    // New props for service location
    serviceLocations = [],
    defaultDate = '',
    defaultTime = '',
    variant = 'standard' // To control which version to display
  } = $props<{
    tributeId?: string;
    slug?: string;
    source?: string;
    serviceLocations?: Array<{
      name: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
    }>;
    defaultDate?: string;
    defaultTime?: string;
    variant?: 'standard' | 'compact' | 'detailed';
  }>();

  // Component state
  // Initialize step to 2 if coming from fd-form, otherwise start at step 1
  let step = $state(source === 'fd-form' ? 2 : 1);
  
  // Use provided service locations or start with an empty template
  let locations = $state(serviceLocations.length > 0 ?
    serviceLocations :
    [{ name: '', address: '', city: '', state: '', zipCode: '' }]);

  console.log('initial locations', locations);
  
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
    isLocationSet = !!state.scheduleDetails.location && !!state.scheduleDetails.location.name; // Check if location name is set
  });

  // Initialize calculator with any provided parameters
  onMount(() => {
    // Reset calculator store
    calculatorStore.reset(tributeId, slug);

    // Set initial step based on parameters (e.g., fd-form might skip to package selection)
    if (source === 'fd-form') {
      // Check for date and time from props first, then fall back to tribute store
      let scheduleDate = defaultDate || '';
      let scheduleTime = defaultTime || '';
      let scheduleDuration = 2;
      let storeServiceLocations: Array<{
        name: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
      }> = [];

      // Use a one-time subscription to get current data if props are not provided
      if (!scheduleDate || !scheduleTime || (serviceLocations.length === 0)) {
        const unsubscribe = tributeDataStore.subscribe(data => {
          if (data && data.service) {
            // Only use store values if prop values aren't provided
            scheduleDate = defaultDate || data.service.date || '';
            scheduleTime = defaultTime || data.service.time || '';
            scheduleDuration = data.service.duration || 2;
            storeServiceLocations = data.service.locations || [] as Array<{
              name: string;
              address: string;
              city: string;
              state: string;
              zipCode: string;
            }>;
          }
        });
        unsubscribe(); // Immediately unsubscribe after getting values
      }

      // Update calculator with data from props or tribute store
      if (scheduleDate && scheduleTime) {
        calculatorStore.updateSchedule({
          date: scheduleDate,
          time: scheduleTime,
          duration: scheduleDuration,
          timeZone: 'America/New_York'
        });
      }

      // Prioritize serviceLocations prop over store data
      if (serviceLocations.length > 0) {
        locations = serviceLocations;
        // Update each location individually
        serviceLocations.forEach((location: ServiceLocation) => {
          if (location.name) {
            calculatorStore.updateLocation(location);
          }
        });
      } else if (storeServiceLocations.length > 0) {
        locations = storeServiceLocations;
        // Update each location individually
        storeServiceLocations.forEach((location: ServiceLocation) => {
          if (location.name) {
            calculatorStore.updateLocation(location);
          }
        });
      } else if (locations.length > 0) {
        // Update each location individually
        locations.forEach((location: ServiceLocation) => {
          if (location.name) {
            calculatorStore.updateLocation(location);
          }
        });
      }

      // Pre-select a standard package by default
      calculatorStore.selectPackage(PackageType.STANDARD);

      step = 2; // Skip to package selection
    } else {
      // For non-fd-form sources, still use props if provided
      if (defaultDate && defaultTime) {
        calculatorStore.updateSchedule({
          date: defaultDate,
          time: defaultTime,
          duration: 2,
          timeZone: 'America/New_York'
        });
      }
      
      if (serviceLocations.length > 0) {
        locations = serviceLocations;
        // Update each location individually
        serviceLocations.forEach(location => {
          if (location.name) {
            calculatorStore.updateLocation(location);
          }
        });
      }
    }
  });

  // Add new location
  function addLocation() {
    locations = [...locations, { name: '', address: '', city: '', state: '', zipCode: '' }];
  }

  // Define service location types
  type ServiceLocation = {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    id?: string; // Optional in our form but might be required by store
  };

  // Define more precise types to use throughout this component
  type AdditionalService = {
    id: string;
    name: string;
    price: number;
    isSelected?: boolean;
    description?: string;
  };

  // Remove location
  function removeLocation(index: number) {
    locations = locations.filter((_: ServiceLocation, i: number) => i !== index);
  }

  // Update location field
  function updateLocation(index: number, field: string, value: string) {
    locations = locations.map((loc: ServiceLocation, i: number) =>
      i === index ? { ...loc, [field]: value } : loc
    );
    
    // Update the location in the calculator store
    if (locations[index] && locations[index].name) {
      calculatorStore.updateLocation(locations[index]);
    }
  }

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

  // Handle payment options with data transfer to tribute store
  function handlePayNow() {
    if (!canProceedFromCurrentStep()) {
      error = 'Please complete all required fields';
      return;
    }

    // Set payment method in calculator
    calculatorStore.setPaymentMethod('credit_card');

    // Get current calculator state to save to tribute data store
    let currentCalcState: CalculatorState | null = null;
    const unsubCalc = calculatorStore.subscribe(state => {
      currentCalcState = state;
    });
    unsubCalc();

    // Save calculator data to the tribute data store for checkout page
    if (currentCalcState) {
      // Extract needed data from calculator
      const packageData = currentCalcState.selectedPackage ? {
        id: PACKAGE_INFO[currentCalcState.selectedPackage].id,
        name: PACKAGE_INFO[currentCalcState.selectedPackage].name,
        price: PACKAGE_INFO[currentCalcState.selectedPackage].price,
        type: currentCalcState.selectedPackage
      } : null;

      // Map additional services format
      const additionalServicesData = currentCalcState.additionalServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        selected: service.isSelected || false
      }));

      // Import to tribute data store
      tributeDataStore.importFromCalculator({
        selectedPackage: packageData,
        additionalServices: additionalServicesData,
        scheduleDetails: currentCalcState.scheduleDetails,
        payment: {
          subtotal: currentCalcState.subtotal,
          tax: currentCalcState.tax,
          total: currentCalcState.total,
          discountCode: currentCalcState.promoCode,
          discountAmount: currentCalcState.discountAmount,
          method: currentCalcState.paymentMethod
        }
      });
    }

    // Navigate to checkout
    goto('/checkout');
  }

  function handlePayLater() {
    if (!canProceedFromCurrentStep()) {
      error = 'Please complete all required fields';
      return;
    }

    // Set payment method
    calculatorStore.setPaymentMethod('invoice');

    // Get current calculator state to save to tribute data store
    let currentCalcState = null;
    const unsubCalc = calculatorStore.subscribe(state => {
      currentCalcState = state;
    });
    unsubCalc();

    // Save calculator data to the tribute data store
    if (currentCalcState) {
      // Similar to handlePayNow but with invoice payment method
      const packageData = currentCalcState.selectedPackage ? {
        id: PACKAGE_INFO[currentCalcState.selectedPackage].id,
        name: PACKAGE_INFO[currentCalcState.selectedPackage].name,
        price: PACKAGE_INFO[currentCalcState.selectedPackage].price,
        type: currentCalcState.selectedPackage
      } : null;

      tributeDataStore.importFromCalculator({
        selectedPackage: packageData,
        additionalServices: currentCalcState.additionalServices.map(service => ({
          id: service.id,
          name: service.name,
          price: service.price,
          selected: service.isSelected || false
        })),
        scheduleDetails: currentCalcState.scheduleDetails,
        payment: {
          subtotal: currentCalcState.subtotal,
          tax: currentCalcState.tax,
          total: currentCalcState.total,
          discountCode: currentCalcState.promoCode,
          discountAmount: currentCalcState.discountAmount,
          method: 'invoice'
        }
      });
    }

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
          <h2 class="text-xl font-semibold">Service Locations</h2>
          {#each locations as location, index}
          <div class="mb-4 p-4 border rounded">
            <h3 class="text-lg font-semibold mb-2">Location {index + 1}</h3>
            <FormField
              name={`locationName-${index}`}
              label="Location Name"
              placeholder="e.g., St. Mary's Church"
              value={location.name}
              required={true}
              on:input={(e) => updateLocation(index, 'name', (e.currentTarget as HTMLInputElement)?.value || '')}
            />

            <FormField
              name={`address-${index}`}
              label="Street Address"
              placeholder="Street address"
              value={location.address}
              required={true}
              on:input={(e) => updateLocation(index, 'address', (e.currentTarget as HTMLInputElement)?.value || '')}
            />

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                name={`city-${index}`}
                label="City"
                placeholder="City"
                value={location.city}
                required={true}
                on:input={(e) => updateLocation(index, 'city', (e.currentTarget as HTMLInputElement)?.value || '')}
              />

              <FormField
                name={`state-${index}`}
                label="State"
                placeholder="State"
                value={location.state}
                required={true}
                on:input={(e) => updateLocation(index, 'state', (e.currentTarget as HTMLInputElement)?.value || '')}
              />

              <FormField
                name={`zipCode-${index}`}
                label="Zip Code"
                placeholder="Zip Code"
                value={location.zipCode}
                required={true}
                on:input={(e) => updateLocation(index, 'zipCode', (e.currentTarget as HTMLInputElement)?.value || '')}
              />
            </div>
            {#if locations.length > 1}
              <Button variant="secondary" size="sm" on:click={() => removeLocation(index)}>Remove Location</Button>
            {/if}
          </div>
          {/each}
          <Button variant="secondary" on:click={addLocation}>Add Location</Button>
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
<script lang="ts">
  import { calculatorStore } from '$lib/stores/calculator';
  import type { ServiceLocation } from '$lib/types/calculator';
  import FormField from '$lib/components/forms/FormField.svelte';
  
  // Location form state
  let locationName = $state('');
  let locationAddress = $state('');
  let locationCity = $state('');
  let locationState = $state('');
  let locationZipCode = $state('');
  
  // Generate a unique ID for this location
  let locationId = $state(`loc_${Date.now()}`);
  
  // Load existing location data if available
  calculatorStore.subscribe(calcState => {
    if (calcState.scheduleDetails.location) {
      const loc = calcState.scheduleDetails.location;
      locationName = loc.name;
      locationAddress = loc.address;
      locationCity = loc.city;
      locationState = loc.state;
      locationZipCode = loc.zipCode;
      locationId = loc.id;
    }
  });
  
  // Save location when form values change
  $effect(() => {
    if (locationName && locationAddress && locationCity && locationState && locationZipCode) {
      const location: ServiceLocation = {
        id: locationId,
        name: locationName,
        address: locationAddress,
        city: locationCity,
        state: locationState,
        zipCode: locationZipCode
      };
      
      calculatorStore.updateLocation(location);
    }
  });
</script>

<div class="location-form space-y-4">
  <h3 class="text-xl font-semibold">Service Location</h3>
  
  <FormField
    name="locationName"
    label="Location Name"
    placeholder="e.g., St. Mary's Church"
    value={locationName}
    required={true}
    on:input={(e) => locationName = (e.currentTarget as HTMLInputElement)?.value || ''}
  />
  
  <FormField
    name="address"
    label="Street Address"
    placeholder="Street address"
    value={locationAddress}
    required={true}
    on:input={(e) => locationAddress = (e.currentTarget as HTMLInputElement)?.value || ''}
  />
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormField
      name="city"
      label="City"
      placeholder="City"
      value={locationCity}
      required={true}
      on:input={(e) => locationCity = (e.currentTarget as HTMLInputElement)?.value || ''}
    />
    
    <FormField
      name="state"
      label="State"
      placeholder="State"
      value={locationState}
      required={true}
      on:input={(e) => locationState = (e.currentTarget as HTMLInputElement)?.value || ''}
    />
    
    <FormField
      name="zipCode"
      label="Zip Code"
      placeholder="Zip Code"
      value={locationZipCode}
      required={true}
      on:input={(e) => locationZipCode = (e.currentTarget as HTMLInputElement)?.value || ''}
    />
  </div>
</div>
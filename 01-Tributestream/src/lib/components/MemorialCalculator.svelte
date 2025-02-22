<script lang="ts">
  import { onMount } from 'svelte';
  import type {
    MemorialFormData,
    Package,
    Location,
    CartItem,
    ScheduleDay,
    CalculatorData,
    WPUserData,
    UserMetadata
  } from '$lib/types/user-metadata';
  import { goto } from '$app/navigation';

  // Props
  let {
    data,
    initialPackage = "Solo",
    onSave,
    onCheckout
  } = $props<{
    data: {
      userData: UserMetadata[];
      wpUserData: WPUserData;
    };
    initialPackage?: string;
    onSave?: (data: OrderData) => void;
    onCheckout?: (data: OrderData) => void;
  }>();

  interface OrderData {
    personalDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    package: {
      name: string;
      scheduleDays: ScheduleDay[];
    };
    orderDetails: {
      pricing: {
        items: CartItem[];
        subtotal: number;
        total: number;
      };
      package: {
        name: string;
        scheduleDays: ScheduleDay[];
      };
    };
  }

  // Constants
  const PACKAGES: Package[] = [
    {
      id: "solo",
      name: "Tributestream Solo",
      description: "Basic memorial package",
      basePrice: 550,
      features: []
    },
    {
      id: "gold",
      name: "Tributestream Gold",
      description: "Enhanced memorial package",
      basePrice: 1100,
      features: []
    },
    {
      id: "legacy",
      name: "Tributestream Legacy",
      description: "Premium memorial package",
      basePrice: 2799,
      features: []
    }
  ];

  const DEFAULT_LOCATION: Location = {
    name: "",
    address: "",
    travelExceedsHour: false,
    startTime: "09:00",
    duration: 2,
    notes: ""
  };

  const DEFAULT_SCHEDULE_DAY: ScheduleDay = {
    date: new Date().toISOString().split('T')[0],
    locations: [{ ...DEFAULT_LOCATION }]
  };

  // Helper functions for parsing location and name data
  function parseLocationName(location: string): string {
    return location?.split('-')[0]?.trim() ?? "";
  }

  function parseLocationAddress(location: string): string {
    return location?.split('-')[1]?.trim() ?? "";
  }

  function parseFullName(name: string | undefined): { firstName: string, lastName: string } {
    if (!name) return { firstName: "", lastName: "" };
    const parts = name.split(' ');
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(' ') || ""
    };
  }

  // Initialize state from userData if available
  let memorialFormData = $state(data.userData[0]?.memorial_form_data);
  let selectedPackage = $state(data.userData[0]?.calculator_data?.selectedPackage || initialPackage);
  
  // Initialize personal details state
  let personalDetails = $state({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  // Initialize location state
  let locationName = $state("");
  let locationAddress = $state("");
  let locationStartTime = $state("09:00");
  let memorialDate = $state(new Date().toISOString().split('T')[0]);

  // Initialize schedule days
  let scheduleDays = $state<ScheduleDay[]>(
    data.userData[0]?.calculator_data?.scheduleDays?.length > 0
      ? data.userData[0].calculator_data.scheduleDays
      : [{ ...DEFAULT_SCHEDULE_DAY }]
  );

  // Effect to update personal details when memorial data changes
  $effect(() => {
    const name = parseFullName(memorialFormData?.familyMember?.name);
    personalDetails = {
      firstName: name.firstName,
      lastName: name.lastName,
      email: memorialFormData?.contact?.email ?? "",
      phone: memorialFormData?.contact?.phone ?? ""
    };
  });

  // Effect to update location data when memorial data changes
  $effect(() => {
    if (memorialFormData?.memorial?.location) {
      locationName = parseLocationName(memorialFormData.memorial.location);
      locationAddress = parseLocationAddress(memorialFormData.memorial.location);
    }
    
    if (memorialFormData?.memorial?.time) {
      locationStartTime = memorialFormData.memorial.time;
    }

    if (memorialFormData?.memorial?.date) {
      memorialDate = memorialFormData.memorial.date;
    }

    // Update initial schedule day with pre-filled data
    if (scheduleDays[0]) {
      scheduleDays[0] = {
        date: memorialDate,
        locations: [{
          name: locationName,
          address: locationAddress,
          travelExceedsHour: false,
          startTime: locationStartTime,
          duration: 2,
          notes: ""
        }]
      };
    }
  });

  // Initialize cart and user ID from userData if available
  let cartItems = $state<CartItem[]>(data.userData[0]?.calculator_data?.cart?.items || []);
  let cartTotal = $state(data.userData[0]?.calculator_data?.cart?.total || 0);
  let userId = $state(data.wpUserData.metaResult.user_id);

  // Save calculator data to WordPress backend
  async function saveCalculatorData() {
    try {
      if (!userId) {
        throw new Error('User ID not available');
      }

      const calculatorData = {
        meta: {
          status: 'draft',
          lastUpdated: new Date().toISOString(),
          version: '2.0.0'
        },
        scheduleDays,
        selectedPackage,
        cart: {
          items: cartItems,
          subtotal: cartTotal,
          total: cartTotal,
          discounts: [],
          taxes: []
        },
        personalDetails
      };

      const response = await fetch('/api/user-meta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          meta_key: 'calculator_data',
          meta_value: JSON.stringify(calculatorData)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save calculator data');
      }

      // Show success message
      alert('Calculator data saved successfully');
      
      return await response.json();
    } catch (error) {
      console.error('Error saving calculator data:', error);
      alert('Failed to save calculator data. Please try again.');
      throw error;
    }
  }

  $effect(() => {
    const items: CartItem[] = [];
    let total = 0;

    // Add package price
    const packageItem = PACKAGES.find(p => p.name.includes(selectedPackage));
    if (packageItem) {
      items.push({
        name: packageItem.name,
        price: packageItem.basePrice
      });
      total += packageItem.basePrice;
    }

    // Calculate costs for all days and locations
    scheduleDays.forEach((day, dayIndex) => {
      // Additional locations beyond the first one cost extra
      day.locations.slice(1).forEach((location, locationIndex) => {
        items.push({
          name: `Additional Location (Day ${dayIndex + 1}, Location ${locationIndex + 2}) - ${location.name}`,
          price: 349
        });
        total += 349;
      });

      // Calculate extra hours for each location
      day.locations.forEach((location, locationIndex) => {
        const extraHours = Math.max(0, location.duration - 2);
        if (extraHours > 0) {
          items.push({
            name: `Extra Duration (Day ${dayIndex + 1}, Location ${locationIndex + 1}) - ${extraHours} additional hours at ${location.name}`,
            price: extraHours * 125
          });
          total += extraHours * 125;
        }
      });
    });

    cartItems = items;
    cartTotal = total;
  });

  // Helper functions
  function addDay() {
    scheduleDays = [...scheduleDays, { ...DEFAULT_SCHEDULE_DAY }];
  }

  function removeDay(dayIndex: number) {
    scheduleDays = scheduleDays.filter((_, i) => i !== dayIndex);
  }

  function addLocation(dayIndex: number) {
    if (scheduleDays[dayIndex].locations.length < 3) {
      scheduleDays = scheduleDays.map((day, i) => 
        i === dayIndex 
          ? { ...day, locations: [...day.locations, { ...DEFAULT_LOCATION }] }
          : day
      );
    }
  }

  function removeLocation(dayIndex: number, locationIndex: number) {
    scheduleDays = scheduleDays.map((day, i) => 
      i === dayIndex 
        ? { ...day, locations: day.locations.filter((_, j) => j !== locationIndex) }
        : day
    );
  }

  async function transformToOrderData(): Promise<OrderData> {
    const orderData = {
      personalDetails,
      package: {
        name: selectedPackage,
        scheduleDays
      },
      orderDetails: {
        pricing: {
          items: cartItems,
          subtotal: cartTotal,
          total: cartTotal
        },
        package: {
          name: selectedPackage,
          scheduleDays
        }
      }
    };

    // Redirect to checkout page
    await goto('/checkout', {
      replaceState: true,
      state: { orderData }
    });

    return orderData;
  }
</script>

<div class="memorial-calculator">
  <!-- Package Selection -->
  <div class="package-selection">
    {#each PACKAGES as pkg}
      <button 
        class="px-4 py-2 rounded-lg border-2 {selectedPackage === pkg.name ? 'border-primary bg-primary/10' : 'border-gray-200'}"
        onclick={() => selectedPackage = pkg.name}
      >
        <span class="block font-semibold">{pkg.name}</span>
        <span class="block text-sm text-gray-600">${pkg.basePrice}</span>
      </button>
    {/each}
  </div>

  <!-- Schedule Days -->
  <div class="schedule-days mt-6 space-y-8">
    {#each scheduleDays as day, dayIndex}
      <div class="day p-4 border rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Day {dayIndex + 1}</h3>
          {#if scheduleDays.length > 1}
            <button 
              onclick={() => removeDay(dayIndex)}
              class="text-sm text-red-600 hover:text-red-700"
            >
              Remove Day
            </button>
          {/if}
        </div>

        <label class="block mb-4">
          <span class="text-sm font-medium text-gray-700">Date:</span>
          <input 
            type="date"
            bind:value={day.date}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </label>

        <!-- Locations for this day -->
        <div class="locations space-y-4">
          {#each day.locations as location, locationIndex}
            <div class="location p-4 border rounded-lg">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium">Location {locationIndex + 1}</h4>
                {#if locationIndex > 0}
                  <button 
                    onclick={() => removeLocation(dayIndex, locationIndex)}
                    class="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove Location
                  </button>
                {/if}
              </div>

              <input 
                type="text"
                placeholder="Location Name"
                bind:value={location.name}
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />

              <input 
                type="text"
                placeholder="Address"
                bind:value={location.address}
                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />

              <div class="grid grid-cols-2 gap-4 mt-2">
                <label class="block">
                  <span class="text-sm font-medium text-gray-700">Start Time:</span>
                  <input 
                    type="time"
                    bind:value={location.startTime}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </label>

                <label class="block">
                  <span class="text-sm font-medium text-gray-700">Duration (hours):</span>
                  <input 
                    type="number"
                    min="1"
                    bind:value={location.duration}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </label>
              </div>

              <label class="mt-2 block">
                <span class="text-sm font-medium text-gray-700">Notes:</span>
                <textarea
                  bind:value={location.notes}
                  rows="2"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                ></textarea>
              </label>

              <label class="mt-2 flex items-center">
                <input 
                  type="checkbox"
                  bind:checked={location.travelExceedsHour}
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span class="ml-2 text-sm text-gray-600">Travel exceeds 1 hour</span>
              </label>
            </div>
          {/each}

          {#if day.locations.length < 3}
            <button 
              onclick={() => addLocation(dayIndex)}
              class="text-sm text-primary hover:text-primary-dark"
            >
              Add Location (${day.locations.length}/3)
            </button>
          {/if}
        </div>
      </div>
    {/each}

    <button 
      onclick={addDay}
      class="w-full py-2 text-center border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary"
    >
      Add Another Day
    </button>
  </div>

  <!-- Cart Summary -->
  <div class="cart-summary mt-8 p-4 bg-gray-50 rounded-lg">
    <h3 class="text-lg font-semibold">Order Summary</h3>
    <div class="mt-4 space-y-2">
      {#each cartItems as item}
        <div class="flex justify-between text-sm">
          <div>
            <span>{item.name}</span>
          </div>
          <span>${item.price}</span>
        </div>
      {/each}
      <div class="pt-4 border-t flex justify-between font-semibold">
        <span>Total:</span>
        <span>${cartTotal}</span>
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="actions mt-6 flex gap-4">
    <button
      onclick={async () => {
        try {
          await saveCalculatorData();
          const orderData = await transformToOrderData();
          await onSave?.(orderData);
        } catch (error) {
          console.error('Error during save:', error);
        }
      }}
      class="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Save
    </button>
    <button
      onclick={async () => await onCheckout?.(await transformToOrderData())}
      class="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Checkout
    </button>
  </div>
</div>
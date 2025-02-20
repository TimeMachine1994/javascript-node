<script lang="ts">
  import type { 
    MemorialFormData, 
    Package, 
    Location, 
    CartItem,
    OrderData 
  } from '$lib/types/memorial-calculator';

  // Props
  let { 
    initialPackage = "Solo",
    initialDuration = 2,
    onSave,
    onCheckout 
  } = $props<{
    initialPackage?: string;
    initialDuration?: number;
    onSave?: (data: OrderData) => void;
    onCheckout?: (data: OrderData) => void;
  }>();

  // Constants
  const PACKAGES: Package[] = [
    { name: "Tributestream Solo", price: 550 },
    { name: "Tributestream Gold", price: 1100 },
    { name: "Tributestream Legacy", price: 2799 }
  ];

  // State
  let memorialFormData = $state<MemorialFormData | undefined>(undefined);
  let selectedPackage = $state(initialPackage);
  let livestreamDate = $state("");
  let livestreamStartTime = $state("");
  let duration = $state(initialDuration);
  let locations = $state<Location[]>([{
    name: "",
    address: "",
    travelExceedsHour: false
  }]);
  let funeralHomeName = $state("");
  let funeralDirectorName = $state("");

  // Derived values
  let locationNumDefault = $derived(
    selectedPackage === "Solo" || selectedPackage === "Legacy" ? 1 : 2
  );

  // Calculate cart items and total
  interface CartData {
    items: CartItem[];
    total: number;
  }

  let cartItems = $state<CartItem[]>([]);
  let cartTotal = $state(0);

  $effect(() => {
    const items: CartItem[] = [];
    let total = 0;

    // Add package price
    const packageItem = PACKAGES.find(p => p.name.includes(selectedPackage));
    if (packageItem) {
      items.push(packageItem);
      total += packageItem.price;
    }

    // Calculate extra hours
    const extraHours = Math.max(0, duration - 2);
    if (extraHours > 0) {
      items.push({
        name: "Extra Duration",
        price: extraHours * 125
      });
      total += extraHours * 125;
    }

    // Calculate additional locations
    locations.slice(1).forEach(() => {
      items.push({
        name: "Additional Location",
        price: 349
      });
      total += 349;
    });

    cartItems = items;
    cartTotal = total;
  });

  // Helper functions
  function addLocation() {
    if (locations.length < locationNumDefault) {
      locations = [...locations, {
        name: "",
        address: "",
        travelExceedsHour: false
      }];
    }
  }

  function removeLocation(index: number) {
    locations = locations.filter((_, i) => i !== index);
  }

  function transformToOrderData(): OrderData {
    return {
      personalDetails: {
        firstName: memorialFormData?.familyMember.firstName ?? "",
        lastName: memorialFormData?.familyMember.lastName ?? "",
        email: memorialFormData?.contact.email ?? "",
        phone: memorialFormData?.contact.phone ?? ""
      },
      package: {
        name: selectedPackage,
        duration,
        livestreamDate,
        livestreamStartTime,
        locations: locations.map(loc => ({
          name: loc.name,
          address: loc.address,
          travelExceedsHour: loc.travelExceedsHour
        }))
      },
      orderDetails: {
        pricing: {
          items: cartItems,
          subtotal: cartTotal,
          total: cartTotal
        },
        package: {
          name: selectedPackage,
          duration,
          livestreamDate,
          livestreamStartTime,
          locations
        }
      }
    };
  }
</script>

<div class="memorial-calculator">
  <!-- Package Selection -->
  <div class="package-selection">
    {#each PACKAGES as pkg}
      <button 
        class="px-4 py-2 rounded-lg border-2 {selectedPackage === pkg.name ? 'border-primary bg-primary/10' : 'border-gray-200'}"
        on:click={() => selectedPackage = pkg.name}
      >
        <span class="block font-semibold">{pkg.name}</span>
        <span class="block text-sm text-gray-600">${pkg.price}</span>
      </button>
    {/each}
  </div>

  <!-- Duration Selection -->
  <div class="duration-selection mt-6">
    <label class="block">
      <span class="text-sm font-medium text-gray-700">Duration (hours):</span>
      <input 
        type="number" 
        min="2"
        bind:value={duration}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
      />
    </label>
  </div>

  <!-- Locations -->
  <div class="locations mt-6 space-y-4">
    {#each locations as location, i}
      <div class="location p-4 border rounded-lg">
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
        <label class="mt-2 flex items-center">
          <input 
            type="checkbox"
            bind:checked={location.travelExceedsHour}
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span class="ml-2 text-sm text-gray-600">Travel exceeds 1 hour</span>
        </label>
        {#if i > 0}
          <button 
            on:click={() => removeLocation(i)}
            class="mt-2 text-sm text-red-600 hover:text-red-700"
          >
            Remove Location
          </button>
        {/if}
      </div>
    {/each}
    {#if locations.length < locationNumDefault}
      <button 
        on:click={addLocation}
        class="text-sm text-primary hover:text-primary-dark"
      >
        Add Location
      </button>
    {/if}
  </div>

  <!-- Cart Summary -->
  <div class="cart-summary mt-8 p-4 bg-gray-50 rounded-lg">
    <h3 class="text-lg font-semibold">Order Summary</h3>
    <div class="mt-4 space-y-2">
      {#each cartItems as item}
        <div class="flex justify-between text-sm">
          <span>{item.name}</span>
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
      on:click={() => onSave?.(transformToOrderData())}
      class="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Save
    </button>
    <button 
      on:click={() => onCheckout?.(transformToOrderData())}
      class="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Checkout
    </button>
  </div>
</div>

<style>
  /* Add any additional custom styles here */
</style>
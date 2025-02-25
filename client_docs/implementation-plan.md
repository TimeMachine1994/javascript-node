# Memorial Calculator Component Implementation Plan

## Data Structures

### TypeScript Interfaces

```typescript
interface Director {
  firstName: string;
  lastName: string;
}

interface FamilyMember {
  firstName: string;
  lastName: string;
  dob: string;
}

interface Deceased {
  firstName: string;
  lastName: string;
  dob: string;
  dop: string;
}

interface Contact {
  email: string;
  phone: string;
}

interface Memorial {
  locationName: string;
  locationAddress: string;
  time: string;
  date: string;
}

interface MemorialFormData {
  director: Director;
  familyMember: FamilyMember;
  deceased: Deceased;
  contact: Contact;
  memorial: Memorial;
}

interface Package {
  name: string;
  price: number;
}

interface Location {
  name: string;
  address: string;
  travelExceedsHour: boolean;
}

interface CartItem {
  name: string;
  price: number;
}
```

## Component Structure

### State Management (Using Runes)
```typescript
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

// Constants
const PACKAGES: Package[] = [
  { name: "Tributestream Solo", price: 550 },
  { name: "Tributestream Gold", price: 1100 },
  { name: "Tributestream Legacy", price: 2799 }
];
```

### Derived Values
```typescript
// Using $derived rune
let locationNumDefault = $derived(
  selectedPackage === "Solo" || selectedPackage === "Legacy" ? 1 : 2
);

let cart = $derived(() => {
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

  return { items, total };
});
```

### Helper Functions
```typescript
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
        items: cart.items,
        subtotal: cart.total,
        total: cart.total
      },
      package: {
        name: selectedPackage,
        duration,
        livestreamDate,
        livestreamStartTime,
        locations: locations
      }
    }
  };
}
```

## Component Template Structure

```svelte
<div class="memorial-calculator">
  <!-- Package Selection -->
  <div class="package-selection">
    {#each PACKAGES as pkg}
      <button 
        class:selected={selectedPackage === pkg.name}
        on:click={() => selectedPackage = pkg.name}
      >
        {pkg.name} - ${pkg.price}
      </button>
    {/each}
  </div>

  <!-- Duration Selection -->
  <div class="duration-selection">
    <label>
      Duration (hours):
      <input 
        type="number" 
        min="2"
        bind:value={duration}
      />
    </label>
  </div>

  <!-- Locations -->
  <div class="locations">
    {#each locations as location, i}
      <div class="location">
        <input 
          type="text"
          placeholder="Location Name"
          bind:value={location.name}
        />
        <input 
          type="text"
          placeholder="Address"
          bind:value={location.address}
        />
        <label>
          <input 
            type="checkbox"
            bind:checked={location.travelExceedsHour}
          />
          Travel exceeds 1 hour
        </label>
        {#if i > 0}
          <button on:click={() => removeLocation(i)}>
            Remove Location
          </button>
        {/if}
      </div>
    {/each}
    {#if locations.length < locationNumDefault}
      <button on:click={addLocation}>
        Add Location
      </button>
    {/if}
  </div>

  <!-- Cart Summary -->
  <div class="cart-summary">
    <h3>Order Summary</h3>
    {#each cart.items as item}
      <div class="cart-item">
        <span>{item.name}</span>
        <span>${item.price}</span>
      </div>
    {/each}
    <div class="cart-total">
      Total: ${cart.total}
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="actions">
    <button on:click={() => onSave?.(transformToOrderData())}>
      Save
    </button>
    <button on:click={() => onCheckout?.(transformToOrderData())}>
      Checkout
    </button>
  </div>
</div>
```

## Implementation Steps

1. Create the component file at `src/lib/components/MemorialCalculator.svelte`
2. Create a types file at `src/lib/types/memorial-calculator.ts`
3. Implement the component following the structure above
4. Add proper TypeScript types and validation
5. Add error handling for edge cases
6. Add proper styling using Tailwind CSS
7. Add documentation for component usage
8. Add unit tests for business logic

## Usage Example

```svelte
<script lang="ts">
import MemorialCalculator from '$lib/components/MemorialCalculator.svelte';

function handleSave(data: OrderData) {
  console.log('Saving:', data);
}

function handleCheckout(data: OrderData) {
  console.log('Proceeding to checkout:', data);
}
</script>

<MemorialCalculator
  initialPackage="Solo"
  initialDuration={2}
  {onSave}
  {onCheckout}
/>
```

## Next Steps

1. Switch to Code mode to implement the component
2. Create necessary type definitions
3. Implement the component following this plan
4. Add proper styling and documentation
5. Test the component functionality
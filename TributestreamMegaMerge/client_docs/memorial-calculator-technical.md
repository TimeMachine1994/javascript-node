# Memorial Calculator Technical Documentation

## Overview
The Memorial Calculator is a SvelteKit 5 component that enables multi-day memorial service scheduling with dynamic pricing calculations. This document provides comprehensive technical details for developers implementing and maintaining the component.

## Table of Contents
1. [Installation](#installation)
2. [Component Usage](#component-usage)
3. [Data Structures](#data-structures)
4. [State Management](#state-management)
5. [Business Logic](#business-logic)
6. [Interface Elements](#interface-elements)
7. [Event Handling](#event-handling)
8. [Pricing Calculations](#pricing-calculations)
9. [Examples](#examples)

## Installation

```bash
# Component is part of the project, no separate installation needed
# Import directly from the lib directory
import { MemorialCalculator } from '$lib';
```

## Component Usage

### Basic Implementation
```svelte
<script lang="ts">
import { MemorialCalculator } from '$lib';
import type { OrderData } from '$lib/types/memorial-calculator';

function handleSave(data: OrderData) {
  // Handle save operation
}

function handleCheckout(data: OrderData) {
  // Handle checkout operation
}
</script>

<MemorialCalculator
  initialPackage="Solo"
  onSave={handleSave}
  onCheckout={handleCheckout}
/>
```

### Props
```typescript
interface Props {
  initialPackage?: string;    // Default: "Solo"
  onSave?: (data: OrderData) => void;
  onCheckout?: (data: OrderData) => void;
}
```

## Data Structures

### Core Types
```typescript
interface Location {
  name: string;
  address: string;
  startTime: string;
  duration: number;      // in hours
  travelExceedsHour: boolean;
  notes: string;
}

interface ScheduleDay {
  date: string;
  locations: Location[];
}

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
```

## State Management

### Reactive State (Using Svelte 5 Runes)
```typescript
// Package Selection
let selectedPackage = $state(initialPackage);

// Schedule Management
let scheduleDays = $state<ScheduleDay[]>([{
  date: new Date().toISOString().split('T')[0],
  locations: [{
    name: "",
    address: "",
    startTime: "09:00",
    duration: 2,
    travelExceedsHour: false,
    notes: ""
  }]
}]);

// Cart State
let cartItems = $state<CartItem[]>([]);
let cartTotal = $state(0);
```

## Business Logic

### Package Pricing
```typescript
const PACKAGES: Package[] = [
  { name: "Tributestream Solo", price: 550 },
  { name: "Tributestream Gold", price: 1100 },
  { name: "Tributestream Legacy", price: 2799 }
];
```

### Location Management Rules
- Maximum 3 locations per day
- Additional locations cost $349 each
- Base duration of 2 hours per location
- Additional hours cost $125/hour

### Pricing Formulas
```typescript
// Additional Location Cost
const additionalLocationCost = 349;

// Extra Hours Cost
const extraHoursCost = 125;

// Total Cost Formula
total = basePackagePrice + 
  (numberOfAdditionalLocations * additionalLocationCost) +
  (totalExtraHours * extraHoursCost);
```

## Interface Elements

### Day Management
```svelte
<!-- Add Day Button -->
<button onclick={addDay}>Add Another Day</button>

<!-- Remove Day Button -->
<button onclick={() => removeDay(dayIndex)}>
  Remove Day
</button>
```

### Location Management
```svelte
<!-- Location Form Fields -->
<input type="text" bind:value={location.name} />
<input type="text" bind:value={location.address} />
<input type="time" bind:value={location.startTime} />
<input type="number" bind:value={location.duration} />
<textarea bind:value={location.notes}></textarea>
```

### Cart Display
```svelte
<!-- Cart Summary -->
<div class="cart-summary">
  {#each cartItems as item}
    <div class="flex justify-between">
      <span>{item.name}</span>
      <span>${item.price}</span>
    </div>
  {/each}
  <div class="total">
    Total: ${cartTotal}
  </div>
</div>
```

## Event Handling

### Day Operations
```typescript
function addDay() {
  scheduleDays = [...scheduleDays, { 
    date: new Date().toISOString().split('T')[0],
    locations: [{ ...DEFAULT_LOCATION }]
  }];
}

function removeDay(dayIndex: number) {
  scheduleDays = scheduleDays.filter((_, i) => i !== dayIndex);
}
```

### Location Operations
```typescript
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
```

## Pricing Calculations

### Cart Calculation Logic
```typescript
$effect(() => {
  const items: CartItem[] = [];
  let total = 0;

  // Base package price
  const packageItem = PACKAGES.find(p => p.name.includes(selectedPackage));
  if (packageItem) {
    items.push(packageItem);
    total += packageItem.price;
  }

  // Calculate per day/location costs
  scheduleDays.forEach((day, dayIndex) => {
    // Additional locations
    day.locations.slice(1).forEach((location, locationIndex) => {
      items.push({
        name: `Additional Location (Day ${dayIndex + 1}, Location ${locationIndex + 2})`,
        price: 349,
        description: location.name
      });
      total += 349;
    });

    // Extra hours
    day.locations.forEach((location, locationIndex) => {
      const extraHours = Math.max(0, location.duration - 2);
      if (extraHours > 0) {
        items.push({
          name: `Extra Duration (Day ${dayIndex + 1}, Location ${locationIndex + 1})`,
          price: extraHours * 125,
          description: `${extraHours} additional hours at ${location.name}`
        });
        total += extraHours * 125;
      }
    });
  });

  cartItems = items;
  cartTotal = total;
});
```

## Examples

### Basic Usage
```svelte
<MemorialCalculator
  initialPackage="Solo"
  onSave={(data) => {
    console.log('Schedule data:', data);
  }}
  onCheckout={(data) => {
    console.log('Proceeding to checkout:', data);
  }}
/>
```

### Complete Implementation Example
```svelte
<script lang="ts">
import { MemorialCalculator } from '$lib';
import type { OrderData } from '$lib/types/memorial-calculator';

async function handleSave(data: OrderData) {
  try {
    const response = await fetch('/api/save-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to save schedule');
    
    const result = await response.json();
    console.log('Schedule saved:', result);
  } catch (error) {
    console.error('Error saving schedule:', error);
  }
}

async function handleCheckout(data: OrderData) {
  try {
    // Validate schedule
    const validationResponse = await fetch('/api/validate-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!validationResponse.ok) {
      throw new Error('Schedule validation failed');
    }
    
    // Proceed to payment
    window.location.href = `/checkout?orderId=${data.orderDetails.orderId}`;
  } catch (error) {
    console.error('Error during checkout:', error);
  }
}
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">
    Schedule Memorial Service
  </h1>
  
  <div class="max-w-4xl mx-auto">
    <MemorialCalculator
      initialPackage="Solo"
      {onSave}
      {onCheckout}
    />
  </div>
</div>
```

## Best Practices

1. State Management
   - Use Svelte 5 runes for reactive state
   - Keep state updates immutable
   - Use $effect for derived calculations

2. Validation
   - Validate dates and times
   - Check for scheduling conflicts
   - Verify location availability
   - Validate pricing calculations

3. Error Handling
   - Handle API errors gracefully
   - Provide user feedback
   - Log errors appropriately
   - Implement retry mechanisms

4. Performance
   - Optimize cart calculations
   - Minimize re-renders
   - Use proper TypeScript types
   - Implement proper loading states

## Troubleshooting

Common Issues:
1. Pricing Discrepancies
   - Verify package selection
   - Check location count
   - Validate duration calculations
   - Review extra hours computation

2. Schedule Conflicts
   - Check date overlaps
   - Verify time slots
   - Validate location availability
   - Review travel time considerations

3. State Updates
   - Verify immutable updates
   - Check effect dependencies
   - Review state initialization
   - Validate prop handling

Last Updated: 2/20/2025
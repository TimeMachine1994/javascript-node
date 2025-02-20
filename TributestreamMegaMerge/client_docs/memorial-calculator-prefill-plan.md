# Memorial Calculator Pre-fill Implementation Plan

## Overview
We need to enhance the memorial calculator to automatically pre-fill information from the memorial form data that's available in the layout. This will improve user experience by eliminating the need to re-enter information that has already been provided.

## Current State
- Memorial form data is available in the layout and passed to the calculator
- Basic user information display is implemented
- Solo package selection is already handled via initialPackage prop
- Location information is not being pre-filled

## Implementation Steps

### 1. Update Location Pre-filling
**File:** `src/lib/components/MemorialCalculator.svelte`

#### Changes Required:
```typescript
// Helper functions for parsing location data
function parseLocationName(location: string): string {
  return location?.split('-')[0]?.trim() ?? "";
}

function parseLocationAddress(location: string): string {
  return location?.split('-')[1]?.trim() ?? "";
}

// Initialize state with proper typing
let locationName = $state("");
let locationAddress = $state("");
let locationStartTime = $state("09:00");

// Effect to update location data when memorial data changes
$effect(() => {
  if (memorialFormData?.memorial?.location) {
    locationName = parseLocationName(memorialFormData.memorial.location);
    locationAddress = parseLocationAddress(memorialFormData.memorial.location);
  }
  
  if (memorialFormData?.memorial?.time) {
    locationStartTime = memorialFormData.memorial.time;
  }
});

// Create the location object when needed
function createInitialLocation(): Location {
  return {
    name: locationName,
    address: locationAddress,
    travelExceedsHour: false,
    startTime: locationStartTime,
    duration: 2,
    notes: ""
  };
}
```

### 2. Update Schedule Days Initialization
**File:** `src/lib/components/MemorialCalculator.svelte`

#### Changes Required:
```typescript
// Initialize schedule state
let memorialDate = $state(new Date().toISOString().split('T')[0]);

// Effect to update date when memorial data changes
$effect(() => {
  if (memorialFormData?.memorial?.date) {
    memorialDate = memorialFormData.memorial.date;
  }
});

// Initialize schedule days with proper state management
let scheduleDays = $state<ScheduleDay[]>([{
  date: memorialDate,
  locations: [createInitialLocation()]
}]);

// Effect to update schedule days when date changes
$effect(() => {
  if (scheduleDays[0]) {
    scheduleDays[0].date = memorialDate;
    scheduleDays[0].locations[0] = createInitialLocation();
  }
});
```

### 3. Update Personal Details Handling
**File:** `src/lib/components/MemorialCalculator.svelte`

#### Changes Required:
```typescript
// Helper function for name parsing
function parseFullName(name: string | undefined): { firstName: string, lastName: string } {
  if (!name) return { firstName: "", lastName: "" };
  const parts = name.split(' ');
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(' ') || ""
  };
}

// Initialize personal details state
let personalDetails = $state({
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
});

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

// Update transformToOrderData to use personal details state
function transformToOrderData(): OrderData {
  return {
    personalDetails,
    package: {
      name: selectedPackage,
      scheduleDays
    },
    // ... rest of the order data
  };
}
```

## Testing Plan

1. **State Management Testing:**
   - Verify all state updates occur properly through effects
   - Ensure no state mutations occur within derived expressions
   - Test that props are not mutated directly

2. **Data Flow Testing:**
   - Verify memorial data changes trigger appropriate effects
   - Test that all computed values update correctly
   - Ensure no circular dependencies in effects

3. **Edge Cases:**
   - Test with missing or malformed memorial data
   - Verify proper fallback values are used
   - Check handling of partial data updates

## Implementation Notes

- Use $state for mutable values that need to trigger updates
- Use $effect for handling side effects and updates based on state changes
- Avoid complex logic inside $derived expressions
- Keep helper functions pure and outside of reactive declarations
- Never mutate props directly unless they are marked with $bindable

## Success Criteria

1. All relevant memorial data is automatically populated
2. State updates properly trigger UI updates
3. No runtime errors from improper rune usage
4. Clean separation between state management and UI logic
5. Proper handling of edge cases and missing data

## Future Considerations

1. Consider implementing state persistence
2. Add loading states for asynchronous operations
3. Implement proper error boundaries
4. Consider adding state reset functionality
5. Add validation before state updates
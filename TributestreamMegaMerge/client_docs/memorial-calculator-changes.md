# Memorial Calculator Component Changes

## Overview
The Memorial Calculator component needs to be updated to work with the UserMetadata type structure. This involves modifying the props and state initialization to properly handle data loaded from the user metadata.

## Required Changes

### Props Update
```typescript
let { data } = $props<{
  data: { userData: UserMetadata[] }
}>();

let {
  initialPackage = "Solo",
  onSave,
  onCheckout
} = $props<{
  initialPackage?: string;
  onSave?: (data: OrderData) => void;
  onCheckout?: (data: OrderData) => void;
}>();
```

### State Initialization
```typescript
// Initialize state from userData if available
let memorialFormData = $state(data.userData[0]?.memorial_form_data);
let selectedPackage = $state(data.userData[0]?.calculator_data?.selectedPackage || initialPackage);
let scheduleDays = $state<ScheduleDay[]>(
  data.userData[0]?.calculator_data?.scheduleDays?.length > 0 
    ? data.userData[0].calculator_data.scheduleDays 
    : [{ ...DEFAULT_SCHEDULE_DAY }]
);

// Initialize cart from userData if available
let cartItems = $state<CartItem[]>(data.userData[0]?.calculator_data?.cartItems || []);
let cartTotal = $state(data.userData[0]?.calculator_data?.cartTotal || 0);
```

## Implementation Notes
1. The component will now accept user metadata as a prop through the `data` property
2. All state variables will be initialized from the user metadata if available, falling back to defaults if not
3. The existing functionality for package selection, scheduling, and cart management remains unchanged
4. The component will still use the same types from `$lib/types/memorial-calculator`

## Next Steps
1. Switch to Code mode to implement these changes
2. Update the MemorialCalculator component with the new props and state initialization
3. Test the component with both new and existing user data
4. Verify that all functionality continues to work as expected
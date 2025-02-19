# Calc.svelte Refactoring Plan

## Objectives
- Refactor the component to use Svelte 5 runes
- Remove store dependencies
- Implement clean state management
- Maintain core functionality
- Use props for component communication

## State Management Changes

### Props
Convert current props to use new runes syntax:
```svelte
let { 
  initialStartTime = '',
  onSave,
  onCheckout
} = $props<{
  initialStartTime?: string,
  onSave: (data: OrderData) => void,
  onCheckout: (data: OrderData) => void
}>();
```

### Form State
Replace current $state object with individual state variables:
```svelte
let selectedPackage = $state('Solo');
let livestreamDate = $state('');
let livestreamStartTime = $state(initialStartTime);
let duration = $state(2);
let locations = $state([{ name: '', address: '', travelExceedsHour: false }]);
let funeralHomeName = $state('');
let funeralDirectorName = $state('');
```

### Derived Values
Maintain derived calculations using $derived:
```svelte
let locationNumDefault = $derived(
  selectedPackage === 'Solo' || selectedPackage === 'Legacy' ? 1 : 2
);

let cartItems = $derived(() => {
  // Cart calculation logic
});
```

## Component Communication
1. Replace store updates with prop functions
2. Emit events for parent components to handle data changes
3. Remove direct store mutations

## Implementation Steps

1. **State Migration**
   - Convert all state to runes
   - Remove store dependencies
   - Implement prop-based communication

2. **Derived Calculations**
   - Maintain cart calculations
   - Keep location number logic
   - Preserve pricing rules

3. **Event Handlers**
   - Update location management
   - Implement save/checkout handlers
   - Handle form submissions

4. **UI Updates**
   - Keep existing layout
   - Maintain responsive design
   - Preserve animations

## Testing Strategy
1. Verify all calculations work correctly
2. Ensure proper prop communication
3. Test form validation
4. Validate cart updates
5. Check location management

## Benefits
- Improved performance
- Better state management
- Cleaner code structure
- Enhanced maintainability
- Better component isolation
# FD Form Confirmation Page Changes

## Overview
Modify the fd-form/confirmation page to remove the calculator visibility and redirect the "continue to payment" action to the /calc page with prefilled data.

## Current Implementation
The current page shows:
- Memorial service confirmation message
- QR code for preview
- Calculator component
- Continue to Payment button (redirects to /schedule/payment_booking)

## Planned Changes

### 1. Remove Calculator Component
- Remove MemorialCalculator import and component
- Remove related functions:
  - handleCalcSave
  - handleCheckout
- Keep form structure for data handling

### 2. Modify Navigation Flow
- Change Continue to Payment button to redirect to /calc instead of /schedule/payment_booking
- Ensure all necessary data is passed to the calculator page:
  - User data
  - Memorial form data
  - WP user data

### 3. Code Changes Required

#### Component Imports
```typescript
// Remove
import MemorialCalculator from '$lib/components/MemorialCalculator.svelte';
```

#### Function Changes
```typescript
// Remove handleCalcSave and handleCheckout functions
// Modify button click handler to navigate to /calc with data
function navigateToCalculator() {
    const queryParams = new URLSearchParams({
        userData: JSON.stringify(data.userData),
        wpUserData: JSON.stringify(wpUserData)
    });
    goto(`/calc?${queryParams}`);
}
```

#### Template Changes
```svelte
<!-- Update button onclick handler -->
<button 
    type="button"
    onclick={navigateToCalculator}
    class="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 mb-2"
>
    Continue to Payment
</button>

<!-- Remove MemorialCalculator component -->
```

## Implementation Steps
1. Create a new branch for these changes
2. Remove calculator-related code
3. Implement new navigation function
4. Update button handler
5. Test data passing to calculator page
6. Verify calculator page receives and processes data correctly

## Testing Plan
1. Verify form submission still works
2. Confirm navigation to calculator page
3. Validate all required data is passed correctly
4. Test QR code functionality remains intact
5. Ensure no regression in existing functionality

## Notes
- The calculator page (/calc) must be updated to handle incoming query parameters
- Consider URL parameter size limitations when passing data
- May need to implement state management if query params become too large
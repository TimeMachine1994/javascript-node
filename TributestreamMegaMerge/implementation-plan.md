# Implementation Plan: FD Form to Payment Booking Integration

## Overview
Implement navigation from FD form confirmation page to payment booking route with data persistence and pre-population.

## Current Architecture
1. FD Form Confirmation Page (`/fd-form/confirmation/+page.svelte`)
   - Contains calculator component (`Calc.svelte`)
   - Saves calculator data to user metadata with key 'calculator_data'
   - Currently has no direct navigation to payment booking

2. Calculator Component (`Calc.svelte`)
   - Manages order data structure:
     ```typescript
     interface OrderData {
         cartItems: CartItem[];
         total: number;
         duration: number;
         livestreamDate: string;
         livestreamStartTime: string;
         locations: Location[];
         selectedPackage: string;
         funeralHomeName: string;
         funeralDirectorName: string;
         memorialData?: MemorialFormData;
     }
     ```

3. Payment Booking Form (`/schedule/payment_booking/+page.svelte`)
   - Expects flattened data structure:
     ```typescript
     interface FormData {
         firstName: string;
         lastName: string;
         email: string;
         phone: string;
         billingAddress: Address;
         shippingAddress: Address;
         cardDetails: CardDetails;
     }
     ```

## Implementation Steps

### 1. Update Calculator Save Handler
```typescript
async function handleCalcSave(orderData: OrderData) {
    try {
        // Save calculator data as before
        const formData = new FormData();
        formData.append('calculatorData', JSON.stringify(orderData));
        
        const response = await fetch('?/saveCalculator', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to save calculator data');
        }

        // Navigate to payment booking on success
        goto('/schedule/payment_booking');
    } catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'An error occurred');
    }
}
```

### 2. Data Integration in Payment Booking Page
1. Load and combine data:
   ```typescript
   async function loadCombinedData() {
       const memorialData = await loadMemorialData();
       const calculatorData = await loadCalculatorData();
       return mergeAndFlattenData(memorialData, calculatorData);
   }
   ```

2. Data transformation function:
   ```typescript
   function mergeAndFlattenData(memorialData, calculatorData) {
       return {
           firstName: memorialData.familyMember.firstName,
           lastName: memorialData.familyMember.lastName,
           email: memorialData.contact.email,
           phone: memorialData.contact.phone,
           billingAddress: {
               street: memorialData.memorial.locationAddress,
               city: '',  // To be filled by user
               state: '', // To be filled by user
               zip: '',   // To be filled by user
               country: 'USA'
           },
           shippingAddress: {}, // Same as billing by default
           orderDetails: {
               package: calculatorData.selectedPackage,
               total: calculatorData.total,
               items: calculatorData.cartItems
           }
       };
   }
   ```

### 3. Update Payment Booking Form
1. Add data loading in page load function:
   ```typescript
   export async function load({ cookies }) {
       const combinedData = await loadCombinedData();
       return {
           formData: combinedData
       };
   }
   ```

2. Pre-populate form fields:
   ```typescript
   <script>
       export let data;
       let formData = data.formData;
   </script>
   ```

## Testing Plan
1. Test calculator data persistence
2. Verify navigation to payment booking
3. Confirm data pre-population
4. Test form submission with combined data
5. Verify error handling

## Security Considerations
1. Validate data integrity during transfer
2. Ensure proper user authentication
3. Sanitize data before display
4. Protect sensitive payment information

## Rollout Strategy
1. Implement changes in development environment
2. Conduct thorough testing
3. Deploy to staging for validation
4. Monitor initial production deployment
5. Plan for rollback if needed
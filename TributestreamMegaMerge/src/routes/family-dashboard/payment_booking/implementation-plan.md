# Payment Booking Checkout Display Implementation Plan

## Overview
This plan outlines the implementation strategy for integrating calculator and memorial form data into the payment booking checkout display.

## Data Sources
1. Calculator Data (from cookie)
   - Package selection
   - Duration
   - Livestream date/time
   - Locations
   - Pricing details (cart items, total)
   - Funeral home/director information

2. Memorial Form Data (from cookie)
   - Director details
   - Family member information
   - Deceased information
   - Contact details
   - Memorial information

## Implementation Steps

### 1. Server-Side Data Loading
1. Implement load function in `+page.server.ts`:
   ```typescript
   export const load = async ({ cookies }) => {
     // Get calculator data
     const calcData = JSON.parse(cookies.get('calculator_data') || '{}');
     
     // Get memorial form data
     const memorialData = JSON.parse(cookies.get('memorial_form_data') || '{}');
     
     // Transform data using utility types
     const transformer: CookieDataTransformer = {
       fromCalculatorCookie: (data) => ({
         package: {
           name: data.selectedPackage,
           duration: data.duration,
           livestreamDate: data.livestreamDate,
           livestreamStartTime: data.livestreamStartTime,
           locations: data.locations
         },
         orderDetails: {
           pricing: {
             items: data.cartItems,
             subtotal: data.total,
             total: data.total
           }
         }
       }),
       fromMemorialFormCookie: (data) => ({
         personalDetails: {
           firstName: data.director.firstName,
           lastName: data.director.lastName,
           email: data.contact.email,
           phone: data.contact.phone
         }
       })
     };

     return {
       formData: {
         ...transformer.fromCalculatorCookie(calcData),
         ...transformer.fromMemorialFormCookie(memorialData)
       }
     };
   };
   ```

### 2. Client-Side Implementation
1. Update `+page.svelte`:
   - Create sections for:
     - Package Details
     - Service Information
     - Pricing Breakdown
     - Personal Information
   - Implement responsive layout
   - Add validation checks

2. Component Structure:
   ```svelte
   <script lang="ts">
     import type { PaymentBookingFormData } from '$lib/types/payment-booking';
     export let data: { formData: PaymentBookingFormData };
   </script>

   <div class="checkout-display">
     <!-- Package Summary -->
     <section>
       <h2>Package Details</h2>
       <div class="package-info">
         <h3>{data.formData.package.name} Package</h3>
         <p>Duration: {data.formData.package.duration} hours</p>
         <p>Date: {data.formData.package.livestreamDate}</p>
         <p>Time: {data.formData.package.livestreamStartTime}</p>
       </div>
     </section>

     <!-- Location Information -->
     <section>
       <h2>Service Locations</h2>
       {#each data.formData.package.locations as location}
         <div class="location">
           <h3>{location.name}</h3>
           <p>{location.address}</p>
         </div>
       {/each}
     </section>

     <!-- Pricing Breakdown -->
     <section>
       <h2>Order Summary</h2>
       {#each data.formData.orderDetails.pricing.items as item}
         <div class="order-item">
           <span>{item.name}</span>
           <span>${item.price}</span>
         </div>
       {/each}
       <div class="total">
         <strong>Total:</strong>
         <strong>${data.formData.orderDetails.pricing.total}</strong>
       </div>
     </section>

     <!-- Personal Information -->
     <section>
       <h2>Contact Information</h2>
       <div class="personal-info">
         <p>{data.formData.personalDetails.firstName} {data.formData.personalDetails.lastName}</p>
         <p>{data.formData.personalDetails.email}</p>
         <p>{data.formData.personalDetails.phone}</p>
       </div>
     </section>
   </div>
   ```

3. Styling:
   - Implement clean, organized layout
   - Use consistent spacing and typography
   - Ensure mobile responsiveness
   - Add visual hierarchy for important information

### 3. Error Handling
1. Implement data validation
2. Add fallback values for missing data
3. Show appropriate error messages
4. Handle edge cases (empty arrays, null values)

### 4. Testing Plan
1. Test with various package types
2. Verify all data is displayed correctly
3. Test responsive layout
4. Validate error handling
5. Test with missing or partial data

## Next Steps
1. Implement server-side load function
2. Create basic component structure
3. Add styling and layout
4. Implement error handling
5. Add tests
6. Review and refine

## Notes
- All monetary values should be properly formatted
- Dates should be displayed in a user-friendly format
- Consider adding edit capabilities for each section
- Implement loading states for data fetching
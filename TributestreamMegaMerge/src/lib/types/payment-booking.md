# Payment Booking Type Definition Plan

## Overview
This document outlines the type definition for the payment booking form that consolidates data from calculator and memorial form cookies.

## Data Sources
1. Calculator Data Cookie (`calculator_data`)
   - Cart items
   - Total pricing
   - Duration
   - Livestream details
   - Locations
   - Selected package
   - Funeral home/director info

2. Memorial Form Cookie (`memorial_form_data`)
   - Director details
   - Family member information
   - Deceased information
   - Contact details
   - Memorial information

## Type Structure

### 1. Package Details
```typescript
interface PackageDetails {
    name: string;
    duration: number;
    livestreamDate: string;
    livestreamStartTime: string;
    locations: Location[];
}
```

### 2. Location Information
```typescript
interface Location {
    name: string;
    address: string;
}
```

### 3. Pricing Details
```typescript
interface OrderItem {
    name: string;
    price: number;
    type?: 'base' | 'addon';
}

interface PricingDetails {
    items: OrderItem[];
    subtotal: number;
    total: number;
}
```

### 4. Personal Information
```typescript
interface PersonalDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}
```

### 5. Address Information
```typescript
interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}
```

## Main Type Definition
```typescript
interface PaymentBookingFormData {
    // Personal Details (from memorial form)
    personalDetails: PersonalDetails;
    
    // Package Information (from calculator)
    package: PackageDetails;
    
    // Pricing (from calculator)
    orderDetails: {
        pricing: PricingDetails;
        package: PackageDetails;
    };
    
    // Address Information (for payment processing)
    billingAddress: Address;
    shippingAddress?: Address;
    
    // Payment Details (handled separately for security)
    cardDetails?: {
        number: string;
        expiry: string;
        cvv: string;
    };
}
```

## Implementation Notes

1. Data Transformation
   - Calculator data will need to be transformed to match the package and pricing structures
   - Memorial form data will populate personal details
   - Address information will be collected during payment

2. Type Usage
   - Used in payment booking page components
   - Provides type safety for form handling
   - Ensures consistent data structure between client/server

3. Security Considerations
   - Card details are optional and only used client-side
   - Sensitive data should not be stored in cookies
   - Server-side validation required for all fields

4. Future Improvements
   - Add validation rules using zod or similar
   - Consider making address fields more granular
   - Add support for different payment methods
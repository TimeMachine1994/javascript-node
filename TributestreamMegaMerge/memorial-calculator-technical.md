# Memorial Calculator Technical Documentation

Last Updated: 2024-02-20

## Current Implementation State

### Data Flow Architecture

1. **Layout Server (`/src/routes/+layout.server.ts`)**
   - Handles JWT authentication with WordPress
   - Parses user data from cookies
   - Transforms WordPress memorial data into our application format
   - Provides userData array containing:
     - memorial_form_data (memorial details)
     - calculator_data (pricing and scheduling)

2. **Calculator Page Server (`/src/routes/calc/+page.server.ts`)**
   - Inherits data from layout server
   - Passes userData through to the page component
   - No additional API calls needed

3. **Calculator Page (`/src/routes/calc/+page.svelte`)**
   - Uses Svelte 5 runes for reactivity
   - Receives and validates userData
   - Renders MemorialCalculator with proper data structure

4. **Memorial Calculator Component (`/src/lib/components/MemorialCalculator.svelte`)**
   - Accepts props:
     - data: { userData: UserMetadata[] }
     - initialPackage: string
   - Handles all calculator logic and UI
   - Manages pricing calculations and schedule management

### Data Structures

```typescript
interface WPMemorialFormData {
  director: {
    firstName: string;
    lastName: string;
  };
  familyMember: {
    firstName: string;
    lastName: string;
    dob: string;
  };
  deceased: {
    firstName: string;
    lastName: string;
    dob: string;
    dop: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  memorial: {
    locationName: string;
    locationAddress: string;
    time: string;
    date: string;
  };
}

interface UserMetadata {
  memorial_form_data: {
    director: {
      firstName: string;
      lastName: string;
    };
    familyMember: {
      name: string;
      dob: string;
    };
    deceased: {
      name: string;
      dob: string;
      dateOfPassing: string;
    };
    contact: {
      email: string;
      phone: string;
    };
    memorial: {
      location: string;
      date: string;
      time: string;
    };
  };
  calculator_data: {
    scheduleDays: ScheduleDay[];
    cartItems: CartItem[];
    cartTotal: number;
    selectedPackage: string;
    personalDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
}
```

### Key Features

1. **Data Pre-filling**
   - Memorial information automatically populated from WordPress
   - Location and schedule information pre-filled
   - Personal details carried over from memorial form

2. **Package Selection**
   - Default "Solo" package with option to upgrade
   - Dynamic pricing based on package selection
   - Additional services can be added

3. **Schedule Management**
   - Multiple days support
   - Multiple locations per day
   - Duration and travel time tracking
   - Notes and special requirements

4. **Pricing Calculation**
   - Base package pricing
   - Additional location fees
   - Extra duration charges
   - Real-time total calculation

### Current Limitations

1. Maximum of 3 locations per day
2. Package upgrades must be selected manually
3. Travel time exceeding 1 hour must be manually indicated

### Next Steps

1. Implement package upgrade recommendations based on schedule complexity
2. Add validation for conflicting schedule times
3. Consider adding location auto-complete and distance calculation
4. Implement save draft functionality for partial bookings

## Development Guidelines

1. **State Management**
   - Use Svelte 5 runes ($state, $derived, $effect)
   - Keep complex state in dedicated state machines
   - Maintain reactivity through proper bindings

2. **Type Safety**
   - Use TypeScript interfaces for all data structures
   - Maintain strict type checking
   - Document type changes in this file

3. **Error Handling**
   - Validate data at component boundaries
   - Provide meaningful error messages
   - Handle edge cases gracefully

4. **Performance**
   - Minimize unnecessary re-renders
   - Use proper Svelte reactivity
   - Keep calculations efficient

## Testing Considerations

1. Verify pre-fill functionality with various memorial data formats
2. Test edge cases in schedule management
3. Validate pricing calculations for all scenarios
4. Ensure proper error handling for missing or invalid data
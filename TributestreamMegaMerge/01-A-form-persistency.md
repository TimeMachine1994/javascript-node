# Form Data Persistence and State Management

## Overview

This document details the data flow and state management between the form directories (fd-form, fd-form/confirmation) and schedule paths (schedule, schedule/payment_booking) in the TributeStream application. The system implements a robust data persistence strategy that maintains consistency across different routes while ensuring a single source of truth.

## Data Flow Architecture

### 1. Initial Form Submission (`/fd-form`)

#### Data Collection
- The memorial information form (`fd-form/+page.svelte`) collects comprehensive information including:
  - Director details (first name, last name)
  - Family member information (name, DOB)
  - Deceased information (name, DOB, date of passing)
  - Contact details (email, phone)
  - Memorial information (location, date, time)

#### Server-Side Processing (`fd-form/+page.server.ts`)
1. Form submission triggers a multi-step process:
   - User registration
   - Authentication (JWT token generation)
   - User metadata storage
   - Tribute creation
   - Email notifications

2. Data Persistence:
   ```typescript
   // Store form data in user metadata
   const metaPayload = {
       user_id: userId,
       meta_key: 'memorial_form_data',
       meta_value: JSON.stringify(memorialData)
   };
   ```

3. Cookie Management:
   - JWT token storage
   - User ID storage
   - User metadata storage
   ```typescript
   cookies.set('jwt_token', token, {
       path: '/',
       httpOnly: true,
       secure: true,
       sameSite: 'strict',
       maxAge: 60 * 60 * 24 * 7 // 7 days
   });
   ```

### 2. Memorial Calculator Integration

#### Component State Management
- Uses Svelte 5 runes for reactive state:
  ```typescript
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

#### Data Structures
```typescript
interface Location {
  name: string;
  address: string;
  startTime: string;
  duration: number;
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
  };
}
```

#### Calculator Data Persistence
- Calculator state is stored in user metadata:
  ```typescript
  const calculatorPayload = {
    meta_key: 'calculator_data',
    meta_value: JSON.stringify({
      scheduleDays,
      cartItems,
      cartTotal,
      selectedPackage,
      personalDetails
    })
  };
  ```

#### Price Calculation Persistence
- Real-time price updates using effects:
  ```typescript
  $effect(() => {
    const items: CartItem[] = [];
    let total = 0;

    // Base package calculation
    const packageItem = PACKAGES.find(p => p.name.includes(selectedPackage));
    if (packageItem) {
      items.push(packageItem);
      total += packageItem.price;
    }

    // Additional costs calculation
    scheduleDays.forEach((day, dayIndex) => {
      // Additional locations
      day.locations.slice(1).forEach((location, locationIndex) => {
        items.push({
          name: `Additional Location (Day ${dayIndex + 1}, Location ${locationIndex + 2})`,
          price: 349
        });
        total += 349;
      });

      // Extra hours
      day.locations.forEach((location, locationIndex) => {
        const extraHours = Math.max(0, location.duration - 2);
        if (extraHours > 0) {
          items.push({
            name: `Extra Duration (Day ${dayIndex + 1}, Location ${locationIndex + 1})`,
            price: extraHours * 125
          });
          total += extraHours * 125;
        }
      });
    });

    cartItems = items;
    cartTotal = total;
  });
  ```

### 3. Schedule Page (`/schedule`)

#### Data Integration
- Combines memorial form data and calculator data
- Implements reactive state management using Svelte's runes:
  ```typescript
  let calculatorEntries = $derived(
      rawMetaData
          .filter((entry: MetaEntry) => entry.meta_key === 'calculator_data')
          .map((entry: MetaEntry) => JSON.parse(entry.meta_value))
  );
  ```

#### Data Flattening
- Implements a flattening strategy for easier data manipulation:
  ```typescript
  flattenedFormData = {
      directorFirstName: parsedData.director.firstName,
      // ... other flattened fields
  };
  ```

## State Management Strategy

### 1. Single Source of Truth
- User metadata in WordPress database serves as the primary data store
- Client-side state is derived from server data through load functions
- Updates are synchronized back to the server through API endpoints
- Calculator state managed through Svelte 5 runes

### 2. Data Propagation Methods
- Server-side load functions populate initial state
- Svelte runes ($state, $derived) manage reactive updates
- Form actions handle data persistence
- Cookies maintain session state and user context
- Real-time price calculations trigger state updates

### 3. State Synchronization
- Form submissions trigger immediate server updates
- Calculator saves update user metadata
- Schedule view combines and displays all relevant data
- Changes in any component trigger appropriate server updates
- Price calculations update in real-time

## Middleware and Stores

### 1. Authentication Middleware
- JWT-based authentication
- Token validation on protected routes
- Automatic token refresh mechanism

### 2. Data Storage
- WordPress REST API for persistent storage
- User metadata for form and calculator data
- Cookie-based session management
- Pricing data stored in calculator state

### 3. State Management Tools
- Svelte's built-in state management
- Runes for reactive state
- Form actions for server communication
- Effects for derived calculations

## Implementation Considerations

### 1. Error Handling
- Comprehensive error catching in data parsing
- Fallback mechanisms for missing data
- User feedback for failed operations
- Validation of pricing calculations

### 2. Performance
- Efficient data serialization
- Minimal state updates
- Optimized server requests
- Memoized price calculations

### 3. Security
- Secure cookie handling
- Protected API endpoints
- Data validation and sanitization
- Price manipulation prevention

## Future Improvements

1. **State Management Enhancement**
   - Consider implementing a more robust state management solution for complex state interactions
   - Potential integration with stores for global state
   - Enhanced calculator state persistence

2. **Data Validation**
   - Implement stronger type checking
   - Add validation schemas for data structures
   - Validate pricing calculations
   - Schedule conflict detection

3. **Caching Strategy**
   - Implement client-side caching for frequently accessed data
   - Add cache invalidation mechanisms
   - Cache pricing calculations

4. **Real-time Updates**
   - Consider WebSocket integration for real-time data synchronization
   - Implement optimistic updates for better user experience
   - Real-time price updates across components
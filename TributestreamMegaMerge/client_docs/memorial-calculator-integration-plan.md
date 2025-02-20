# Memorial Calculator Integration Plan

Last Updated: 2024-02-20

## Overview

This plan outlines the integration of Memorial Calculator output data into both the user metadata system and homepage display.

## Current Architecture Analysis

1. **Data Flow**
   - Layout server (`+layout.server.ts`) transforms WordPress data into UserMetadata format
   - Calculator data structure exists in UserMetadata interface
   - User meta API endpoint handles data persistence

2. **Key Components**
   - MemorialCalculator component generates calculator_data
   - Layout server manages userData array
   - User meta API supports GET/POST operations
   - WordPress backend stores user metadata

## Implementation Plan

### 1. Enhance MemorialCalculator Component

```typescript
// src/lib/components/MemorialCalculator.svelte

interface SaveCalculatorData {
  user_id: number;
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

// Add save functionality
async function saveCalculatorData(data: SaveCalculatorData) {
  try {
    const response = await fetch('/api/user-meta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: data.user_id,
        meta_key: 'calculator_data',
        meta_value: JSON.stringify(data.calculator_data)
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save calculator data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving calculator data:', error);
    throw error;
  }
}
```

### 2. Update Layout Server

```typescript
// src/routes/+layout.server.ts

// Enhance the userData transformation to include calculator_data
const userData: UserMetadata = {
  memorial_form_data: {
    // ... existing memorial form data mapping
  },
  calculator_data: wpUserData.metaResult?.meta_value ? 
    JSON.parse(wpUserData.metaResult.meta_value).calculator_data || {
      scheduleDays: [],
      cartItems: [],
      cartTotal: 0,
      selectedPackage: '',
      personalDetails: {
        firstName: wpMemorialData.familyMember.firstName,
        lastName: wpMemorialData.familyMember.lastName,
        email: wpMemorialData.contact.email,
        phone: wpMemorialData.contact.phone
      }
    } : {
      // Default calculator data structure
      scheduleDays: [],
      cartItems: [],
      cartTotal: 0,
      selectedPackage: '',
      personalDetails: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      }
    }
};
```


## Implementation Steps

1. **Phase 1: Data Persistence**
   - Implement saveCalculatorData function in MemorialCalculator
   - Add save triggers on key calculator events
   - Test data persistence with WordPress backend

2. **Phase 2: Data Loading**
   - Update layout server to properly load calculator data
   - Ensure proper type checking and data validation
   - Test data loading with various scenarios



## Testing Requirements

1. **Data Persistence**
   - Verify calculator data saves correctly
   - Test error handling and recovery
   - Validate data structure integrity

2. **Data Loading**
   - Test with various data scenarios
   - Verify proper handling of missing data
   - Check type safety

3. **Display Testing**
   - Test responsive design
   - Verify currency formatting
   - Check accessibility

## Security Considerations

1. Ensure proper JWT token handling
2. Validate user permissions for data access
3. Sanitize data before storage and display
4. Implement proper error handling

## Next Steps

1. Review and approve implementation plan
2. Begin Phase 1 implementation
3. Set up testing environment
4. Schedule code review sessions
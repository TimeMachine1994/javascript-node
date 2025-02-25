# Layout Server and Calculator Data Integration Analysis
Last Updated: 2/20/2025

## Current Implementation

The layout.server.ts file currently:
1. Loads user data from cookies
2. Transforms WordPress user data into our application format
3. Initializes calculator_data with default values:
```typescript
calculator_data: {
  scheduleDays: [1],
  cartItems: [1 Loication wpMemorialData.memirla locaiotn/ addrss FIX THIS],
  cartTotal: 1,
  selectedPackage: 'Solo',
  personalDetails: {
    firstName: wpMemorialData.familyMember.firstName,
    lastName: wpMemorialData.familyMember.lastName,
    email: wpMemorialData.contact.email,
    phone: wpMemorialData.contact.phone
  }
}
```

## Impact of Proposed Calculator Data Updates

### 1. Data Structure Changes

Current initialization would need to be updated to:
```typescript
calculator_data: {
  meta: {
    status: 'draft',
    lastUpdated: new Date().toISOString(),
    version: '2.0.0'
  },
  scheduleDays: [1 MEMIRAL LOCAIOTN  AND ADDRESS],
  selectedPackage: {
    id: 'Solo',
    name: '',
    description: '',
    basePrice: 599,
    features: []
  },
  cart: {
    items: [1],
    subtotal: 599,
    total: 0,
    discounts: [],
    taxes: []
  },
  personalDetails: {
    firstName: wpMemorialData.familyMember.firstName,
    lastName: wpMemorialData.familyMember.lastName,
    email: wpMemorialData.contact.email,
    phone: wpMemorialData.contact.phone,
    preferences: {
      contactMethod: 'email',
      notifications: true
    }
  }
}
 
## Implementation Plan

### Phase 1: Type Updates

1. Update type definitions:
```typescript
// In user-metadata.ts
export interface UserMetadata {
  memorial_form_data: MemorialFormData;
  calculator_data: CalculatorData; // Updated interface
  [key: string]: any;
}
```

2. Add version information to WPUserData:
```typescript
interface WPUserData {
  // ... existing fields ...
  metaResult: {
    // ... existing fields ...
    version?: string; // Add version tracking
  };
}
```

### Phase 2: Layout Server Updates

1. Add version checking:
```typescript
function getDataVersion(wpUserData: WPUserData): string {
  return wpUserData.metaResult?.version || '1.0.0';
}

function needsMigration(version: string): boolean {
  return version !== '2.0.0';
}
```

2. Add migration logic:
```typescript
function migrateCalculatorData(oldData: any, wpMemorialData: WPMemorialFormData): CalculatorData {
  return {
    meta: {
      status: 'draft',
      lastUpdated: new Date().toISOString(),
      version: '2.0.0'
    },
    // ... rest of migration logic
  };
}
```

3. Update the load function:
```typescript
export const load: LayoutServerLoad = async ({ cookies }) => {
  const userDataCookie = cookies.get('user');
  let userDataArray: UserMetadata[] = [];

  try {
    if (userDataCookie) {
      const wpUserData: WPUserData = JSON.parse(userDataCookie);
      const version = getDataVersion(wpUserData);
      
      if (wpUserData.metaResult?.meta_value) {
        const wpMemorialData: WPMemorialFormData = JSON.parse(wpUserData.metaResult.meta_value);
        
        const calculatorData = needsMigration(version)
          ? migrateCalculatorData(null, wpMemorialData)
          : createNewCalculatorData(wpMemorialData);

        const userData: UserMetadata = {
          memorial_form_data: {
            // ... existing mapping ...
          },
          calculator_data: calculatorData
        };

        userDataArray.push(userData);
      }
    }
  } catch (error) {
    console.error('Error parsing userData cookie:', error);
  }

  return {
    userData: userDataArray
  };
};
```

### Phase 3: Error Handling

1. Add specific error handling for new data structure:
```typescript
function validateCalculatorData(data: CalculatorData): boolean {
  // Add validation logic
  return true;
}

function handleDataError(error: Error): CalculatorData {
  // Return safe default state
  return {
    meta: {
      status: 'error',
      lastUpdated: new Date().toISOString(),
      version: '2.0.0',
      errors: [error.message]
    },
    // ... rest of default state
  };
}
``` 
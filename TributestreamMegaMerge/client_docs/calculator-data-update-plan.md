# Calculator Data Update Analysis
Last Updated: 2/20/2025

## Current Structure
```typescript
export interface CalculatorData {
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
}
```

## Analysis of Current Implementation

### Strengths
1. Simple and flat structure
2. Clear separation of schedule and pricing data
3. Basic personal details included

### Limitations
1. No package details beyond name
2. No status tracking for the calculation process
3. Limited validation metadata
4. No timestamp or version information
5. No support for draft/temporary calculations

## Proposed Updates

### 1. Enhanced Package Information
```typescript
interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
}
```

### 2. Improved Cart Structure
```typescript
interface CartData {
  items: CartItem[];
  subtotal: number;
  total: number;
  discounts: {
    code: string;
    amount: number;
  }[];
  taxes: {
    name: string;
    rate: number;
    amount: number;
  }[];
}
```

### 3. Status Tracking
```typescript
type CalculationStatus = 'draft' | 'in_progress' | 'complete' | 'error';

interface CalculationMeta {
  status: CalculationStatus;
  lastUpdated: string; // ISO timestamp
  version: string;
  errors?: string[];
}
```

### 4. Updated CalculatorData Interface
```typescript
export interface CalculatorData {
  // Metadata
  meta: CalculationMeta;
  
  // Schedule Information
  scheduleDays: ScheduleDay[];
  
  // Package Information
  selectedPackage: Package;
  
  // Pricing Information
  cart: CartData;
  
  // Personal Information
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferences?: {
      contactMethod: 'email' | 'phone';
      notifications: boolean;
    };
  };
  
  // Additional Options
  additionalNotes?: string;
  specialRequirements?: string[];
}
```

## Implementation Plan

### Phase 1: Structure Update
1. Create new interfaces in user-metadata.ts
2. Update existing calculator components to use new structure
3. Add migration logic for existing data

### Phase 2: Feature Implementation
1. Add status tracking functionality
2. Implement enhanced package selection
3. Add improved cart calculations
4. Add validation for new fields

### Phase 3: UI Updates
1. Update forms to include new fields
2. Add status indicators
3. Enhance package selection interface
4. Improve cart display

## Migration Strategy

1. **Version Check**
```typescript
function isLegacyCalculatorData(data: any): data is OldCalculatorData {
  return !data.meta && !data.cart;
}
```

2. **Data Migration**
```typescript
function migrateCalculatorData(oldData: OldCalculatorData): CalculatorData {
  return {
    meta: {
      status: 'complete',
      lastUpdated: new Date().toISOString(),
      version: '2.0.0'
    },
    scheduleDays: oldData.scheduleDays,
    selectedPackage: {
      id: 'legacy',
      name: oldData.selectedPackage,
      description: '',
      basePrice: 0,
      features: []
    },
    cart: {
      items: oldData.cartItems,
      subtotal: oldData.cartTotal,
      total: oldData.cartTotal,
      discounts: [],
      taxes: []
    },
    personalDetails: oldData.personalDetails
  };
}
```

## API Considerations

1. Update WordPress metadata endpoints to handle new structure
2. Maintain backward compatibility during transition
3. Add validation middleware for new fields
4. Update error handling for new fields

## Testing Strategy

1. Unit tests for new interfaces
2. Migration tests
3. Integration tests for updated calculator
4. End-to-end testing of full calculation flow

## Rollout Plan

1. Deploy structure updates
2. Migrate existing data
3. Enable new features progressively
4. Monitor for any issues
5. Complete rollout to all users

## Next Steps

1. Review proposed structure changes
2. Prioritize implementation phases
3. Create detailed technical specifications
4. Begin implementation of Phase 1
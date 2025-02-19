# Calc.svelte Component Specification

## Overview
The Calc.svelte component is responsible for calculating livestream costs based on various parameters and managing the scheduling interface. This document outlines the technical specifications for the component.

## Input Parameters

### Props Interface
```typescript
{
    initialStartTime?: string;         // Optional, ISO time string (HH:mm)
    onSave?: (data: OrderData) => void;
    onCheckout?: (data: OrderData) => void;
    initialMemorialData?: MemorialFormData;
}
```

### Validation Rules

#### Date and Time
- **livestreamDate**
  - Required
  - Must be a future date
  - Format: YYYY-MM-DD
  - Validation: Must be at least 24 hours in advance
  
- **livestreamStartTime**
  - Required
  - Format: HH:mm (24-hour)
  - Validation: Must be between 06:00 and 20:00

#### Duration
- **duration**
  - Required
  - Type: number
  - Range: 2-8 hours
  - Step: 1 hour
  - Default: 2 hours

#### Package Selection
- **selectedPackage**
  - Required
  - Type: string
  - Valid values: "Solo", "Gold", "Legacy"
  - Default: "Solo"

#### Location Information
- **locations**
  - Required
  - Type: Array of Location objects
  - Minimum: 1 location
  - Maximum: Based on package
    - Solo: 1 location
    - Gold: 2 locations
    - Legacy: 1 location
  - Each location requires:
    - name: string (1-100 characters)
    - address: string (5-200 characters)
    - travelExceedsHour: boolean

#### Contact Information
- **funeralHomeName**
  - Required
  - Type: string
  - Length: 2-100 characters
  
- **funeralDirectorName**
  - Required
  - Type: string
  - Length: 2-100 characters

## Output Interface

### OrderData Structure
```typescript
interface OrderData {
    cartItems: CartItem[];            // Array of items with name and price
    total: number;                    // Total cost in USD
    duration: number;                 // Duration in hours
    livestreamDate: string;          // YYYY-MM-DD
    livestreamStartTime: string;     // HH:mm
    locations: Location[];           // Array of location objects
    selectedPackage: string;         // Package name
    funeralHomeName: string;         // Funeral home name
    funeralDirectorName: string;     // Director's name
    memorialData?: MemorialFormData; // Optional memorial data
}
```

### Price Calculations
- Base package prices (USD):
  - Solo: $550
  - Gold: $1,100
  - Legacy: $2,799
- Additional costs:
  - Extra hours beyond 2 hours: $125/hour
  - Additional locations: $349/location

## Error Handling

### Required Field Validation
- All required fields must be validated before allowing save/checkout
- Empty required fields should trigger visual feedback
- Error messages should be displayed near the relevant field

### Date/Time Validation
- Invalid dates (past dates) should be prevented
- Invalid times (outside 06:00-20:00) should be prevented

### Location Validation
- Validate address format and existence
- Validate travel time exceeds 1 hour

## State Management

### Local State
The component uses Svelte's $state for managing:
- Package selection
- Date/time information
- Duration
- Location information
- Funeral home/director information

### Derived State
- locationNumDefault: Derived from selectedPackage
- cartCalculation: Derived from package, duration, and locations

### State Updates
- All state updates should trigger immediate price recalculation
- State should persist during component lifecycle
- Initial state should be populated from props when available

## Concurrent Calculations

### Race Condition Prevention
- Implement debouncing for price calculations (300ms recommended)
- Use atomic updates for state changes
- Ensure cart calculations complete before save/checkout

### Performance Considerations
- Memoize cart calculations when inputs haven't changed
- Batch DOM updates for price display
- Optimize location additions/removals

## Integration Points

### Parent Component Communication
- onSave callback: Triggered when "Save and Pay Later" is clicked
- onCheckout callback: Triggered when "Save and Checkout Now" is clicked
- Props for initial data population

### External Systems
- Payment processing system integration via onCheckout
- Memorial data system integration via MemorialFormData
- Location validation/geocoding system (future implementation)

## Data Type Precision

### Monetary Values
- All prices stored as numbers
- Display formatted with 2 decimal places
- Calculations performed with full precision
- Rounding only applied for display

### Time Values
- Dates stored in YYYY-MM-DD format
- Times stored in HH:mm format (24-hour)
- Duration stored as integer hours

## Component Lifecycle

### Initialization
1. Load initial props
2. Set default values for uninitialized state
3. Calculate initial cart total
4. Render form with initial values



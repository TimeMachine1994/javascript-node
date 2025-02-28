# SvelteKit 5 Data Flow Architecture Plan

## 1. Current State Analysis

Based on examining the codebase, we have the following components and stores that handle data flow:

- **FuneralDirectorForm**: Initial data entry point
- **BookingCalculator**: Package and service selection 
- **FamilyDashboard**: User management interface
- **Checkout**: Final transaction processing
- **Data Stores**: `tributeDataStore` and `calculatorStore`

### Current Flow Issues

1. **Multiple data sources**: Data originates in multiple components (fd-form, booking-calculator)
2. **Overlapping stores**: Two stores with partial duplication of information
3. **Bi-directional flow**: Data flows in multiple directions, making it difficult to track
4. **Limited TypeScript integration**: Types exist but aren't consistently enforced
5. **No use of SvelteKit 5 runes**: Current code uses older patterns

## 2. Proposed Architecture

I recommend creating a unified, strongly-typed data flow system with SvelteKit 5's runes and props:

### 2.1 Core Data Types

Create a comprehensive TypeScript interface structure in `src/lib/types/tribute-flow.ts`:

```typescript
// Common types used across the application
export interface PersonInfo {
  fullName: string;
  email?: string;
  phone?: string;
  organization?: string;
}

export interface LocationInfo {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ScheduleInfo {
  date: string;
  time: string;
  duration: number; 
  timeZone: string;
  location?: LocationInfo;
}

export interface PackageInfo {
  id: string;
  name: string;
  price: number;
  type: 'basic' | 'standard' | 'premium';
  description?: string;
}

export interface AdditionalServiceInfo {
  id: string;
  name: string;
  price: number;
  description?: string;
  selected: boolean;
}

export interface PaymentInfo {
  method: 'credit_card' | 'invoice' | null;
  status: 'pending' | 'completed' | 'failed' | null;
  subtotal: number;
  tax: number;
  total: number;
  discountCode?: string;
  discountAmount?: number;
}

// Core data model for the entire application
export interface TributeFlowData {
  // Metadata
  id?: string;
  slug: string;
  customUrl: string;
  
  // Deceased information
  deceased: {
    fullName: string;
    dateOfBirth?: string;
    dateOfPassing?: string;
    photoUrl?: string;
  };
  
  // Service information
  schedule: ScheduleInfo;
  
  // Organizer information
  organizer: PersonInfo & {
    type: 'family' | 'funeral_director' | 'other';
  };
  
  // Package and payment information
  package: PackageInfo | null;
  additionalServices: AdditionalServiceInfo[];
  payment: PaymentInfo;
  
  // Status information
  published: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Form-specific data interfaces
export interface FdFormData {
  deceasedName: string;
  dateOfBirth?: string;
  dateOfPassing: string;
  serviceDate: string;
  serviceTime: string;
  serviceLocation: string;
  serviceAddress: string;
  serviceCity: string;
  serviceState: string;
  serviceZipCode: string;
  serviceDuration: number;
  directorName: string;
  funeralHome: string;
  directorEmail: string;
  directorPhone: string;
  paymentChoice: 'credit_card' | 'invoice' | null;
}

export interface CalculatorFormData {
  selectedPackage: PackageInfo | null;
  additionalServices: AdditionalServiceInfo[];
  scheduleDetails: ScheduleInfo;
  payment: PaymentInfo;
}
```

### 2.2 Central Store with SvelteKit 5 Runes

Create a unified store in `src/lib/stores/tribute-flow-store.ts`:

```typescript
import { browser } from '$app/environment';
import { slugify } from '$lib/utils/slugify';
import type { 
  TributeFlowData, 
  FdFormData, 
  CalculatorFormData,
  LocationInfo
} from '$lib/types/tribute-flow';

// Default initial state
const createDefaultState = (): TributeFlowData => ({
  slug: '',
  customUrl: '',
  
  deceased: {
    fullName: '',
  },
  
  schedule: {
    date: '',
    time: '',
    duration: 2,
    timeZone: 'America/New_York',
  },
  
  organizer: {
    fullName: '',
    email: '',
    phone: '',
    type: 'family',
  },
  
  package: null,
  additionalServices: [],
  payment: {
    method: null,
    status: null,
    subtotal: 0,
    tax: 0,
    total: 0,
  },
  
  published: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Create the tribute flow store using SvelteKit 5 runes API
export function createTributeFlowStore() {
  // Using $state to make this reactive
  let tributeData = $state<TributeFlowData>(loadFromStorage() || createDefaultState());
  
  // Load data from storage if available
  function loadFromStorage(): TributeFlowData | null {
    if (browser) {
      const stored = localStorage.getItem('tributeFlowData');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored tribute data', e);
        }
      }
    }
    return null;
  }
  
  // Save to storage
  function saveToStorage() {
    if (browser) {
      localStorage.setItem('tributeFlowData', JSON.stringify(tributeData));
    }
  }
  
  // Update state and save
  function updateState(newData: Partial<TributeFlowData>) {
    tributeData = {
      ...tributeData,
      ...newData,
      updatedAt: new Date().toISOString()
    };
    saveToStorage();
  }
  
  // Reset the store
  function reset(tributeId?: string) {
    tributeData = {
      ...createDefaultState(),
      id: tributeId,
      updatedAt: new Date().toISOString()
    };
    saveToStorage();
  }
  
  // Import data from Funeral Director Form
  function importFromFdForm(formData: FdFormData) {
    const slug = slugify(formData.deceasedName);
    const locationId = `loc_${Date.now()}`;
    
    const location: LocationInfo = {
      id: locationId,
      name: formData.serviceLocation,
      address: formData.serviceAddress,
      city: formData.serviceCity,
      state: formData.serviceState,
      zipCode: formData.serviceZipCode
    };
    
    updateState({
      slug,
      customUrl: `http://www.tributestream.com/celebration-of-life-for-${slug}`,
      
      deceased: {
        fullName: formData.deceasedName,
        dateOfBirth: formData.dateOfBirth || '',
        dateOfPassing: formData.dateOfPassing
      },
      
      schedule: {
        date: formData.serviceDate,
        time: formData.serviceTime,
        duration: formData.serviceDuration,
        timeZone: 'America/New_York',
        location
      },
      
      organizer: {
        fullName: formData.directorName,
        email: formData.directorEmail,
        phone: formData.directorPhone,
        organization: formData.funeralHome,
        type: 'funeral_director'
      },
      
      payment: {
        ...tributeData.payment,
        method: formData.paymentChoice
      }
    });
  }
  
  // Import data from Calculator
  function importFromCalculator(calculatorData: CalculatorFormData) {
    updateState({
      package: calculatorData.selectedPackage,
      additionalServices: calculatorData.additionalServices,
      
      schedule: {
        ...tributeData.schedule,
        date: calculatorData.scheduleDetails.date || tributeData.schedule.date,
        time: calculatorData.scheduleDetails.time || tributeData.schedule.time,
        timeZone: calculatorData.scheduleDetails.timeZone || tributeData.schedule.timeZone,
        duration: calculatorData.scheduleDetails.duration || tributeData.schedule.duration,
        location: calculatorData.scheduleDetails.location || tributeData.schedule.location
      },
      
      payment: {
        ...tributeData.payment,
        method: calculatorData.payment.method,
        subtotal: calculatorData.payment.subtotal,
        tax: calculatorData.payment.tax,
        total: calculatorData.payment.total,
        discountCode: calculatorData.payment.discountCode,
        discountAmount: calculatorData.payment.discountAmount
      }
    });
  }
  
  // Expose all values and functions
  return {
    // Derived state using $derived
    get data() { return $derived(tributeData); },
    get deceased() { return $derived(tributeData.deceased); },
    get schedule() { return $derived(tributeData.schedule); },
    get organizer() { return $derived(tributeData.organizer); },
    get package() { return $derived(tributeData.package); },
    get additionalServices() { return $derived(tributeData.additionalServices); },
    get payment() { return $derived(tributeData.payment); },
    get slug() { return $derived(tributeData.slug); },
    get customUrl() { return $derived(tributeData.customUrl); },
    
    // Methods
    reset,
    updateState,
    importFromFdForm,
    importFromCalculator,
    
    // Helper methods to update specific parts
    updateDeceased(deceased: Partial<TributeFlowData['deceased']>) {
      const newDeceased = { ...tributeData.deceased, ...deceased };
      
      // Update slug if name changes
      if (deceased.fullName) {
        const slug = slugify(deceased.fullName);
        updateState({
          deceased: newDeceased,
          slug,
          customUrl: `http://www.tributestream.com/celebration-of-life-for-${slug}`
        });
      } else {
        updateState({ deceased: newDeceased });
      }
    },
    
    updateSchedule(schedule: Partial<TributeFlowData['schedule']>) {
      updateState({
        schedule: { ...tributeData.schedule, ...schedule }
      });
    },
    
    updateOrganizer(organizer: Partial<TributeFlowData['organizer']>) {
      updateState({
        organizer: { ...tributeData.organizer, ...organizer }
      });
    },
    
    updatePayment(payment: Partial<TributeFlowData['payment']>) {
      updateState({
        payment: { ...tributeData.payment, ...payment }
      });
    },
    
    setPackage(packageInfo: TributeFlowData['package']) {
      // Recalculate totals
      const packagePrice = packageInfo?.price || 0;
      const additionalServicesTotal = tributeData.additionalServices
        .filter(service => service.selected)
        .reduce((sum, service) => sum + service.price, 0);
        
      const subtotal = packagePrice + additionalServicesTotal;
      const tax = subtotal * 0.085; // 8.5% tax rate
      const total = subtotal + tax;
      
      updateState({
        package: packageInfo,
        payment: {
          ...tributeData.payment,
          subtotal,
          tax,
          total
        }
      });
    },
    
    toggleAdditionalService(serviceId: string) {
      const updatedServices = tributeData.additionalServices.map(service =>
        service.id === serviceId ? { ...service, selected: !service.selected } : service
      );
      
      // Recalculate totals
      const packagePrice = tributeData.package?.price || 0;
      const additionalServicesTotal = updatedServices
        .filter(service => service.selected)
        .reduce((sum, service) => sum + service.price, 0);
        
      const subtotal = packagePrice + additionalServicesTotal;
      const tax = subtotal * 0.085; // 8.5% tax rate
      const total = subtotal + tax;
      
      updateState({
        additionalServices: updatedServices,
        payment: {
          ...tributeData.payment,
          subtotal,
          tax,
          total
        }
      });
    }
  };
}

// Create and export the singleton instance
export const tributeFlow = createTributeFlowStore();
```

### 2.3 Component Updates with SvelteKit 5 Props

Key components should be updated to use SvelteKit 5's new props system:

#### Example: FuneralDirectorForm.svelte

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import FormField from '$lib/components/forms/FormField.svelte';
  import { tributeFlow } from '$lib/stores/tribute-flow-store';
  import type { FdFormData } from '$lib/types/tribute-flow';
  
  // Component state with runes
  let formState = $state('editing'); // editing, generating, success
  let isSubmitting = $state(false);
  let formError = $state<string | null>(null);
  let generatedLink = $state('');
  
  // Form fields
  let formData = $state<FdFormData>({
    deceasedName: '',
    dateOfPassing: '',
    serviceDate: '',
    serviceTime: '',
    serviceLocation: '',
    serviceAddress: '',
    serviceCity: '',
    serviceState: '',
    serviceZipCode: '',
    serviceDuration: 2,
    directorName: '',
    funeralHome: '',
    directorEmail: '',
    directorPhone: '',
    paymentChoice: null
  });
  
  // Derived values with SvelteKit 5 $derived
  let slugifiedName = $derived(formData.deceasedName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''));
    
  let customLink = $derived(`http://www.tributestream.com/celebration-of-life-for-${slugifiedName}`);
  
  // Form validation
  let isFormValid = $derived(
    // validation checks
  );
  
  // Handle form submission
  async function handleSubmit(event: SubmitEvent) {
    // Form validation code...
    
    // Submit the data to the store
    tributeFlow.importFromFdForm(formData);
    
    // Get the slug from the tribute flow
    const slug = tributeFlow.slug;
    generatedLink = `http://www.tributestream.com/celebration-of-life-for-${slug}`;
    formState = 'success';
  }
</script>
```

#### Example: BookingCalculator.svelte

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { tributeFlow } from '$lib/stores/tribute-flow-store';
  import type { LocationInfo } from '$lib/types/tribute-flow';
  
  // Component props with SvelteKit 5
  let {
    tributeId = '',
    slug = '',
    source = '',
    serviceLocations = [],
    defaultDate = '',
    defaultTime = '',
    variant = 'standard'
  } = $props<{
    tributeId?: string;
    slug?: string;
    source?: string;
    serviceLocations?: LocationInfo[];
    defaultDate?: string;
    defaultTime?: string;
    variant?: 'standard' | 'compact' | 'detailed';
  }>();
  
  // Component state with runes
  let step = $state(source === 'fd-form' ? 2 : 1);
  let locations = $state<LocationInfo[]>(serviceLocations.length > 0 ?
    serviceLocations :
    [{ id: `loc_${Date.now()}`, name: '', address: '', city: '', state: '', zipCode: '' }]);
  
  // Computed values with $derived
  let isPackageSelected = $derived(!!tributeFlow.package);
  let isDateSelected = $derived(!!tributeFlow.schedule.date && !!tributeFlow.schedule.time);
  let isLocationSet = $derived(!!tributeFlow.schedule.location?.name);
  
  // Update location field and sync to tribute flow
  function updateLocation(index: number, field: string, value: string) {
    locations = locations.map((loc, i) =>
      i === index ? { ...loc, [field]: value } : loc
    );
    
    // Update the main data store with the location
    if (locations[index]?.name) {
      tributeFlow.updateSchedule({
        location: locations[index]
      });
    }
  }
  
  // Handle payment
  function handlePayNow() {
    tributeFlow.updatePayment({
      method: 'credit_card'
    });
    
    goto('/checkout');
  }
</script>
```

## 3. Data Flow Patterns

### 3.1 Component-to-Component Data Flow

With SvelteKit 5's props system, we can pass data directly between components:

```svelte
<!-- Parent component -->
<script>
  import ChildComponent from './ChildComponent.svelte';
  import { tributeFlow } from '$lib/stores/tribute-flow-store';
  
  // We can pass TypeScript-typed data directly to child components
  let locationData = $derived(tributeFlow.schedule.location);
</script>

<ChildComponent location={locationData} />

<!-- Child component -->
<script>
  import type { LocationInfo } from '$lib/types/tribute-flow';
  
  // Strongly typed props
  let { location } = $props<{
    location: LocationInfo;
  }>();
</script>
```

### 3.2 Page-to-Page Data Flow

SvelteKit 5's enhanced load function system and runes can improve page-to-page data flow:

```typescript
// +page.ts
export async function load({ params, fetch }) {
  // Get the slug from URL params
  const { slug } = params;
  
  // Fetch data from API
  const response = await fetch(`/api/tributes/${slug}`);
  const tributeData = await response.json();
  
  // Return the data 
  return {
    tributeData
  };
}

// +page.svelte
<script>
  import { tributeFlow } from '$lib/stores/tribute-flow-store';
  
  // Get the data from the load function with $props in SvelteKit 5
  let { tributeData } = $props<{
    tributeData: TributeFlowData;
  }>();
  
  // Initialize store with loaded data
  $: {
    if (tributeData) {
      tributeFlow.updateState(tributeData);
    }
  }
</script>
```

## 4. Benefits of this Architecture

1. **Unified Store**: A single source of truth for all application data
2. **Type Safety**: Comprehensive TypeScript interfaces for all data structures
3. **Runes Optimization**: Makes full use of SvelteKit 5's reactive primitives
4. **Unidirectional Data Flow**: Predictable data flow patterns
5. **Performance**: Better reactivity model reduces unnecessary re-renders
6. **Maintainability**: Clear separation of concerns and data dependencies
7. **Modern Architecture**: Aligned with SvelteKit 5's latest patterns and best practices

## 5. Migration Strategy

To implement this architecture while minimizing disruption:

1. **Create Core Infrastructure**: 
   - Build the new types and store implementation
   - Set up the foundation for the new data flow

2. **Component Migration (One at a time)**:
   - Start with fd-form as the initial data source
   - Move to booking-calculator as it's a critical component
   - Update family-dashboard and checkout components
   - Maintain backward compatibility during the transition

3. **Testing and Validation**:
   - Test each component after migration
   - Validate the full user flow
   - Ensure data consistency throughout the process

4. **Legacy Code Removal**:
   - After successful migration, remove old stores
   - Clean up any deprecated code
   - Complete the transition to the new architecture

## 6. Implementation Timeline

1. **Setup and Planning**: 1-2 days
   - Create types and initialize store
   - Set up testing infrastructure

2. **Core Component Migration**: 3-5 days
   - fd-form: 1 day
   - booking-calculator: 1-2 days  
   - family-dashboard: 1 day
   - checkout: 1 day

3. **Testing and Refinement**: 2-3 days
   - Flow testing
   - Performance optimization
   - Bug fixes

4. **Final Integration**: 1-2 days
   - Remove legacy code
   - Final testing
   - Documentation
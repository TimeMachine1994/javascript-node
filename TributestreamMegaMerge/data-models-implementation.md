# SvelteKit Tribute Platform Data Models Implementation Guide

## Overview

This document provides detailed specifications for implementing the data models, state management, and data flow for the Tribute Platform rebuild. It extends the high-level rebuild plan with concrete implementation details to ensure type safety, proper state management, and consistent data handling throughout the application.

## Core Data Models

### 1. User Data Domain

```typescript
// src/lib/types/user.ts

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
}

export enum UserRole {
  FAMILY_MEMBER = 'family_member',
  FUNERAL_DIRECTOR = 'funeral_director',
  CONTRIBUTOR = 'contributor',
  ADMIN = 'admin'
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
  };
  error?: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
  };
  displayMode: 'light' | 'dark' | 'system';
  timezone?: string;
}

export interface UserMetadata {
  memorial_form_data?: string; // JSON string of MemorialFormData
  calculator_data?: string;    // JSON string of CalculatorData
  payment_history?: string;    // JSON string of payment records
  recent_activity?: string;    // JSON string of user activity log
}
```

### 2. Tribute Data Domain

```typescript
// src/lib/types/tribute.ts

export interface Tribute {
  id: string;
  slug: string;
  deceased: DeceasedInfo;
  pointOfContact: ContactInfo;
  funeralDirector?: ContactInfo;
  scheduleDetails: ScheduleDetails;
  paymentDetails?: PaymentDetails;
  mediaItems?: MediaItem[];
  contributors?: Contributor[];
  visibility: TributeVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface DeceasedInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: string;
  dateOfPassing: string;
  biography?: string;
  photoUrl?: string;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship?: string;
  dateOfBirth?: string;
  userId?: string; // Reference to User if they have an account
}

export interface ScheduleDetails {
  date: string;
  time: string;
  locations: Location[];
  duration: number; // in hours
  timeZone: string;
  notes?: string;
}

export interface Location {
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  startTime: string;
  duration: number;
  notes?: string;
  mapUrl?: string;
}

export interface PaymentDetails {
  status: PaymentStatus;
  amount: number;
  currency: string;
  packageId: string;
  packageName: string;
  transactionId?: string;
  paymentMethod?: string;
  paymentDate?: string;
  dueDate?: string;
  invoiceUrl?: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIAL = 'partial'
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  isApproved: boolean;
}

export interface Contributor {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'contributor' | 'admin';
  invitedBy: string;
  invitedAt: string;
  joinedAt?: string;
}

export enum TributeVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted'
}
```

### 3. Calculator Data Domain

```typescript
// src/lib/types/calculator.ts

export interface CalculatorData {
  meta: {
    status: 'initial' | 'in_progress' | 'complete';
    lastUpdated: string;
    version: string;
    tributeId?: string;
  };
  scheduleDays: ScheduleDay[];
  selectedPackage?: Package;
  cart: Cart;
  personalDetails: PersonalDetails;
}

export interface ScheduleDay {
  date: string;
  locations: Location[]; // Using Location from tribute.ts
}

export interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
  isRecommended?: boolean;
  additionalOptions?: AdditionalOption[];
}

export interface AdditionalOption {
  id: string;
  name: string;
  description: string;
  price: number;
  isSelected: boolean;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
  discounts: Discount[];
  taxes: Tax[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'package' | 'addon' | 'service';
  details?: string;
}

export interface Discount {
  id: string;
  name: string;
  code?: string;
  amount: number;
  type: 'percentage' | 'fixed';
  appliedAt: string;
}

export interface Tax {
  id: string;
  name: string;
  rate: number;
  amount: number;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferences: {
    contactMethod: 'email' | 'phone' | 'sms';
    notifications: boolean;
  };
}
```

## State Management Implementation

### 1. Store Structure

```typescript
// src/lib/stores/tribute.ts
import { writable, derived } from 'svelte/store';
import type { Tribute } from '$lib/types/tribute';

// Main tribute store with Map for efficient lookups
const createTributeStore = () => {
  const { subscribe, set, update } = writable<Map<string, Tribute>>(new Map());
  
  return {
    subscribe,
    set,
    update,
    
    // Add a single tribute
    addTribute: (tribute: Tribute) => update(tributes => {
      tributes.set(tribute.id, tribute);
      return tributes;
    }),
    
    // Add multiple tributes
    addTributes: (tributesList: Tribute[]) => update(tributes => {
      for (const tribute of tributesList) {
        tributes.set(tribute.id, tribute);
      }
      return tributes;
    }),
    
    // Get tribute by ID
    getTribute: (id: string) => {
      let result: Tribute | undefined;
      update(tributes => {
        result = tributes.get(id);
        return tributes;
      });
      return result;
    },
    
    // Get tribute by slug
    getTributeBySlug: (slug: string) => {
      let result: Tribute | undefined;
      update(tributes => {
        for (const tribute of tributes.values()) {
          if (tribute.slug === slug) {
            result = tribute;
            break;
          }
        }
        return tributes;
      });
      return result;
    },
    
    // Remove a tribute by ID
    removeTribute: (id: string) => update(tributes => {
      tributes.delete(id);
      return tributes;
    }),
    
    // Clear all tributes
    clear: () => set(new Map())
  };
};

export const tributeStore = createTributeStore();

// Derived stores for common operations
export const tributesList = derived(tributeStore, $tributeStore => 
  Array.from($tributeStore.values())
);

export const recentTributes = derived(tributeStore, $tributeStore => 
  Array.from($tributeStore.values())
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
);
```

```typescript
// src/lib/stores/user.ts
import { writable, derived } from 'svelte/store';
import type { User, AuthState, UserMetadata } from '$lib/types/user';
import { browser } from '$app/environment';

// Initialize from localStorage if available
const initAuthState = (): AuthState => {
  if (browser) {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored auth state', e);
      }
    }
  }
  
  return { isAuthenticated: false, user: null };
};

// Create the auth store
const createAuthStore = () => {
  const { subscribe, set, update } = writable<AuthState>(initAuthState());
  
  // Subscribe to changes and update localStorage
  if (browser) {
    subscribe(state => {
      localStorage.setItem('auth', JSON.stringify(state));
    });
  }
  
  return {
    subscribe,
    
    // Set login state
    login: (user: User, tokens: AuthState['tokens']) => set({
      isAuthenticated: true,
      user,
      tokens,
      error: undefined
    }),
    
    // Update user data
    updateUser: (user: User) => update(state => ({
      ...state,
      user
    })),
    
    // Set logout state
    logout: () => set({
      isAuthenticated: false,
      user: null,
      tokens: undefined,
      error: undefined
    }),
    
    // Set error state
    setError: (error: string) => update(state => ({
      ...state,
      error
    }))
  };
};

// Create user metadata store
const createUserMetadataStore = () => {
  const { subscribe, set, update } = writable<UserMetadata | null>(null);
  
  return {
    subscribe,
    set,
    
    // Update a specific metadata field
    updateField: <K extends keyof UserMetadata>(
      key: K, 
      value: UserMetadata[K]
    ) => update(metadata => {
      if (!metadata) metadata = {};
      return { ...metadata, [key]: value };
    }),
    
    // Clear all metadata
    clear: () => set(null)
  };
};

export const authStore = createAuthStore();
export const userMetadataStore = createUserMetadataStore();

// Derived store for current user
export const currentUser = derived(authStore, $authStore => $authStore.user);
```

```typescript
// src/lib/stores/calculator.ts
import { writable } from 'svelte/store';
import type { CalculatorData, Package, CartItem } from '$lib/types/calculator';
import { browser } from '$app/environment';

// Initialize from localStorage if available
const initCalculatorData = (): CalculatorData | null => {
  if (browser) {
    const stored = localStorage.getItem('calculator');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored calculator data', e);
      }
    }
  }
  
  return null;
};

// Create the calculator store
const createCalculatorStore = () => {
  const { subscribe, set, update } = writable<CalculatorData | null>(initCalculatorData());
  
  // Subscribe to changes and update localStorage
  if (browser) {
    subscribe(data => {
      if (data) {
        localStorage.setItem('calculator', JSON.stringify(data));
      } else {
        localStorage.removeItem('calculator');
      }
    });
  }
  
  return {
    subscribe,
    set,
    
    // Initialize with default values
    initialize: (tributeId?: string) => set({
      meta: {
        status: 'initial',
        lastUpdated: new Date().toISOString(),
        version: '1.0',
        tributeId
      },
      scheduleDays: [{
        date: '',
        locations: []
      }],
      selectedPackage: undefined,
      cart: {
        items: [],
        subtotal: 0,
        total: 0,
        discounts: [],
        taxes: []
      },
      personalDetails: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        preferences: {
          contactMethod: 'email',
          notifications: true
        }
      }
    }),
    
    // Update schedule days
    updateSchedule: (scheduleDays) => update(data => {
      if (!data) return data;
      return {
        ...data,
        scheduleDays,
        meta: {
          ...data.meta,
          status: 'in_progress',
          lastUpdated: new Date().toISOString()
        }
      };
    }),
    
    // Select a package
    selectPackage: (pkg: Package) => update(data => {
      if (!data) return data;
      
      // Create a cart item for the package
      const packageItem: CartItem = {
        id: pkg.id,
        name: pkg.name,
        price: pkg.basePrice,
        quantity: 1,
        type: 'package'
      };
      
      // Filter out any existing package items
      const filteredItems = data.cart.items.filter(item => item.type !== 'package');
      
      // Calculate new total
      const subtotal = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), pkg.basePrice);
      
      return {
        ...data,
        selectedPackage: pkg,
        cart: {
          ...data.cart,
          items: [packageItem, ...filteredItems],
          subtotal,
          total: subtotal // Taxes and discounts would be applied separately
        },
        meta: {
          ...data.meta,
          status: 'in_progress',
          lastUpdated: new Date().toISOString()
        }
      };
    }),
    
    // Add a cart item
    addCartItem: (item: CartItem) => update(data => {
      if (!data) return data;
      
      // Check if item already exists
      const existingItemIndex = data.cart.items.findIndex(i => i.id === item.id);
      let newItems;
      
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...data.cart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + item.quantity
        };
      } else {
        // Add new item
        newItems = [...data.cart.items, item];
      }
      
      // Calculate new total
      const subtotal = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      
      return {
        ...data,
        cart: {
          ...data.cart,
          items: newItems,
          subtotal,
          total: subtotal // Taxes and discounts would be applied separately
        },
        meta: {
          ...data.meta,
          status: 'in_progress',
          lastUpdated: new Date().toISOString()
        }
      };
    }),
    
    // Update personal details
    updatePersonalDetails: (details) => update(data => {
      if (!data) return data;
      return {
        ...data,
        personalDetails: {
          ...data.personalDetails,
          ...details
        },
        meta: {
          ...data.meta,
          status: 'in_progress',
          lastUpdated: new Date().toISOString()
        }
      };
    }),
    
    // Finalize the calculator
    finalize: () => update(data => {
      if (!data) return data;
      return {
        ...data,
        meta: {
          ...data.meta,
          status: 'complete',
          lastUpdated: new Date().toISOString()
        }
      };
    }),
    
    // Clear calculator data
    clear: () => set(null)
  };
};

export const calculatorStore = createCalculatorStore();
```

## Form Handling and Data Validation

### 1. Form Submission Handling

```typescript
// src/lib/utils/form-handler.ts
import { enhance } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';

export interface FormOptions {
  onSubmit?: () => void;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
  resetForm?: boolean;
}

export function createFormHandler(options: FormOptions = {}): SubmitFunction {
  return () => {
    // Trigger onSubmit callback
    if (options.onSubmit) {
      options.onSubmit();
    }
    
    return async ({ result, update }) => {
      // Update the form with the result
      await update();
      
      if (result.type === 'success') {
        // Handle successful response
        if (options.onSuccess) {
          options.onSuccess(result.data);
        }
      } else if (result.type === 'failure') {
        // Handle errors
        if (options.onError) {
          options.onError(result.error?.message || 'An error occurred');
        }
      }
      
      // Always call onComplete
      if (options.onComplete) {
        options.onComplete();
      }
    };
  };
}
```

### 2. Data Validation

```typescript
// src/lib/utils/validators.ts
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface FieldValidator {
  (value: any): string | null;
}

export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone || !phone.trim()) {
    return 'Phone number is required';
  }
  
  // Basic phone validation - customize for your needs
  if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
    return 'Please enter a valid phone number';
  }
  
  return null;
}

export function validateRequired(value: any, fieldName: string = 'This field'): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  
  if (typeof value === 'string' && !value.trim()) {
    return `${fieldName} is required`;
  }
  
  return null;
}

export function validateDate(date: string): string | null {
  if (!date || !date.trim()) {
    return 'Date is required';
  }
  
  // Check if date is valid
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Please enter a valid date';
  }
  
  return null;
}

export function validateFutureDate(date: string): string | null {
  const baseError = validateDate(date);
  if (baseError) return baseError;
  
  const dateObj = new Date(date);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (dateObj < now) {
    return 'Date must be in the future';
  }
  
  return null;
}

// Validate an entire object against a schema of validators
export function validateObject<T extends Record<string, any>>(
  data: T,
  validators: Record<keyof T, FieldValidator>
): ValidationResult {
  const errors: Record<string, string> = {};
  
  for (const key in validators) {
    if (Object.prototype.hasOwnProperty.call(validators, key)) {
      const validator = validators[key];
      const value = data[key];
      const error = validator(value);
      
      if (error) {
        errors[key] = error;
      }
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
```

## Usage Examples

### 1. Home Page Form with Validation

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import { validateObject, validateRequired, validateEmail, validatePhone } from '$lib/utils/validators';
  import { createFormHandler } from '$lib/utils/form-handler';
  import { slugify } from '$lib/utils/strings';
  
  // Form state
  let lovedOneName = $state('');
  let fullName = $state('');
  let phoneNumber = $state('');
  let emailAddress = $state('');
  let formState = $state('initial'); // initial, editing, submitting, success
  let formErrors = $state<Record<string, string>>({});
  let isSubmitting = $state(false);
  
  // Derived values using Svelte 5's $derived
  let slugifiedName = $derived(
    slugify(lovedOneName)
  );
  
  let customLink = $derived(
    `https://tributestream.com/celebration-of-life-for-${slugifiedName}`
  );
  
  // Validate the form
  function validateForm() {
    const validators = {
      lovedOneName: (value: string) => validateRequired(value, "Loved one's name"),
      fullName: (value: string) => validateRequired(value, "Your name"),
      phoneNumber: validatePhone,
      emailAddress: validateEmail
    };
    
    const result = validateObject(
      { lovedOneName, fullName, phoneNumber, emailAddress },
      validators
    );
    
    formErrors = result.errors;
    return result.valid;
  }
  
  // Form submission handler
  const handleSubmit = createFormHandler({
    onSubmit: () => {
      if (!validateForm()) return false;
      isSubmitting = true;
    },
    onSuccess: (data) => {
      formState = 'success';
    },
    onError: (error) => {
      formErrors.form = error;
    },
    onComplete: () => {
      isSubmitting = false;
    }
  });
</script>

<!-- Form HTML would go here -->
```

### 2. Booking Calculator with State Management

```svelte
<!-- src/routes/booking-calculator/+page.svelte -->
<script lang="ts">
  import { calculatorStore } from '$lib/stores/calculator';
  import type { Package } from '$lib/types/calculator';
  import PackageSelector from '$lib/components/calculator/PackageSelector.svelte';
  import ScheduleSelector from '$lib/components/calculator/ScheduleSelector.svelte';
  import CartSummary from '$lib/components/calculator/CartSummary.svelte';
  import { goto } from '$app/navigation';
  
  // Get initial data from page data (server)
  export let data;
  
  // Initialize the calculator store if needed
  $effect(() => {
    if (!$calculatorStore) {
      calculatorStore.initialize(data.tributeId);
    }
  });
  
  // Handle package selection
  function selectPackage(pkg: Package) {
    calculatorStore.selectPackage(pkg);
  }
  
  // Handle schedule update
  function updateSchedule(schedule) {
    calculatorStore.updateSchedule(schedule);
  }
  
  // Navigate to checkout
  function goToCheckout() {
    calculatorStore.finalize();
    goto('/checkout');
  }
  
  // Save and pay later
  function saveAndPayLater() {
    calculatorStore.finalize();
    goto('/family-dashboard');
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Memorial Service Calculator</h1>
  
  <!-- Package selection -->
  <PackageSelector 
    packages={data.packages} 
    selectedPackage={$calculatorStore?.selectedPackage}
    onSelect={selectPackage}
  />
  
  <!-- Schedule selection -->
  <ScheduleSelector
    scheduleDays={$calculatorStore?.scheduleDays || []}
    onChange={updateSchedule}
  />
  
  <!-- Cart summary -->
  <CartSummary cart={$calculatorStore?.cart} />
  
  <!-- Action buttons -->
  <div class="flex justify-end space-x-4 mt-8">
    <button
      class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
      on:click={saveAndPayLater}
    >
      Save and Pay Later
    </button>
    
    <button
      class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
      on:click={goToCheckout}
    >
      Pay Now
    </button>
  </div>
</div>
```

### 3. API Integration

```typescript
// src/lib/api/tribute.ts
import type { Tribute } from '$lib/types/tribute';

export async function getTributeBySlug(slug: string): Promise<Tribute | null> {
  try {
    const response = await fetch(`/api/tributes/by-slug?slug=${encodeURIComponent(slug)}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch tribute');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tribute by slug:', error);
    return null;
  }
}

export async function createTribute(tributeData: Omit<Tribute, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tribute | null> {
  try {
    const response = await fetch('/api/tributes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tributeData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create tribute');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating tribute:', error);
    return null;
  }
}

export async function updateTribute(id: string, tributeData: Partial<Tribute>): Promise<Tribute | null> {
  try {
    const response = await fetch(`/api/tributes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tributeData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update tribute');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating tribute:', error);
    return null;
  }
}

export async function searchTributes(query: string): Promise<Tribute[]> {
  try {
    const response = await fetch(`/api/tributes?search=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to search tributes');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching tributes:', error);
    return [];
  }
}
```

## Type-Safe API Route Handlers

```typescript
// src/routes/api/tributes/by-slug/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tribute } from '$lib/types/tribute';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const slug = url.searchParams.get('slug');
  
  if (!slug) {
    return json({ error: 'Slug parameter is required' }, { status: 400 });
  }
  
  try {
    // Fetch from database or external API
    // This is a mockup of the implementation
    const response = await fetch(`/internal/db/tributes?slug=${encodeURIComponent(slug)}`);
    
    if (!response.ok) {
      return json({ error: 'Tribute not found' }, { status: 404 });
    }
    
    const tribute: Tribute = await response.json();
    return json(tribute);
  } catch (error) {
    console.error('Error in by-slug endpoint:', error);
    return json({ error: 'Server error' }, { status: 500 });
  }
};
```

## Conclusion

This data models implementation guide provides the foundation for a type-safe, well-structured SvelteKit application rebuild. By following these patterns for data modeling, state management, form handling, and API integration, the application will be more maintainable, have fewer bugs, and be better equipped for future enhancements.

Key benefits of this approach include:

1. **Type Safety** - Clear interfaces for all data structures
2. **State Isolation** - Properly separated concerns in the store implementation
3. **Form Validation** - Reusable validation patterns
4. **Progressive Enhancement** - Forms that work with or without JavaScript
5. **Consistent API Integration** - Type-safe API communication

By implementing these patterns consistently throughout the application, developers will have a solid foundation for building the various user interfaces and workflows described in the main implementation plan.
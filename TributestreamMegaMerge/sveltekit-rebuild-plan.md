# SvelteKit Tribute Platform Rebuild Plan

## Project Overview
This document outlines a comprehensive plan to rebuild the Tribute/Memorial platform using SvelteKit with proper typing, efficient routing, and optimized state management. The rebuild will be created in a new folder within the existing project structure, allowing for parallel development without disrupting the current application.

## Architecture Principles
- **Type Safety**: Implement strong TypeScript typing throughout the application
- **Clean Routing**: Utilize SvelteKit's routing system efficiently
- **Centralized State Management**: Create a cohesive state management strategy
- **Component Reusability**: Build modular components with clear interfaces
- **Progressive Enhancement**: Ensure forms work with or without JavaScript
- **Accessibility**: Maintain WCAG compliance throughout

## Project Structure

```
TributestreamMegaMerge/
└── tribute-rebuild/               # New subfolder for the rebuild
    ├── src/
    │   ├── lib/
    │   │   ├── components/        # Reusable UI components
    │   │   │   ├── ui/            # Base UI components
    │   │   │   ├── forms/         # Form components
    │   │   │   ├── memorial/      # Memorial-specific components
    │   │   │   ├── dashboard/     # Dashboard components
    │   │   │   └── calculator/    # Calculator components
    │   │   ├── stores/            # State management
    │   │   │   ├── tribute.ts     # Tribute data store
    │   │   │   ├── user.ts        # User data store
    │   │   │   └── calculator.ts  # Calculator state
    │   │   ├── types/             # TypeScript type definitions
    │   │   │   ├── api.ts         # API response types
    │   │   │   ├── tribute.ts     # Tribute data types
    │   │   │   ├── user.ts        # User data types
    │   │   │   └── calculator.ts  # Calculator data types
    │   │   ├── utils/             # Utility functions
    │   │   └── api/               # API interaction helpers
    │   ├── routes/
    │   │   ├── +layout.svelte     # Main layout
    │   │   ├── +page.svelte       # Home page
    │   │   ├── search/            # Search functionality
    │   │   ├── fd-form/           # Funeral director form
    │   │   ├── booking-calculator/ # Booking calculator
    │   │   ├── checkout/          # Checkout page
    │   │   ├── family-dashboard/  # Family dashboard
    │   │   ├── celebration-of-life-for-[slug]/ # Tribute page
    │   │   └── api/               # API endpoints (copied from original)
    │   └── app.d.ts               # Global type definitions
    └── static/                    # Static assets
```

## Core Data Types

### User Types
```typescript
// src/lib/types/user.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
}

export enum UserRole {
  FAMILY_MEMBER = 'family_member',
  FUNERAL_DIRECTOR = 'funeral_director',
  CONTRIBUTOR = 'contributor',
  ADMIN = 'admin'
}

export interface UserMetadata {
  memorial_form_data?: string; // JSON string of MemorialFormData
  // Other metadata as needed
}
```

### Tribute Types
```typescript
// src/lib/types/tribute.ts
export interface Tribute {
  id: string;
  slug: string;
  deceased: DeceasedInfo;
  pointOfContact: ContactInfo;
  funeralDirector?: ContactInfo;
  scheduleDetails: ScheduleDetails;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DeceasedInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: string;
  dateOfPassing?: string;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
}

export interface ScheduleDetails {
  date: string;
  time: string;
  locations: Location[];
  duration: number; // in hours
}

export interface Location {
  name: string;
  address: string;
  startTime: string;
  duration: number;
  notes?: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
  FAILED = 'failed'
}
```

### Calculator Types
```typescript
// src/lib/types/calculator.ts
export interface CalculatorData {
  meta: {
    status: 'initial' | 'in_progress' | 'complete';
    lastUpdated: string;
    version: string;
  };
  scheduleDays: ScheduleDay[];
  selectedPackage?: Package;
  cart: Cart;
  personalDetails: PersonalDetails;
}

export interface ScheduleDay {
  date: string;
  locations: Location[];
}

export interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
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
}

export interface Discount {
  id: string;
  name: string;
  amount: number;
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

## State Management Strategy

The application will use a combination of:

1. **SvelteKit's built-in form handling** for initial data submission
2. **Svelte stores** for managing application state
3. **Local storage** for persisting user preferences and draft data
4. **Server data** for authoritative information

### Core Stores

```typescript
// src/lib/stores/tribute.ts
export const tributeStore = writable<Map<string, Tribute>>(new Map());

// src/lib/stores/user.ts
export const userStore = writable<User | null>(null);
export const userMetadataStore = writable<UserMetadata | null>(null);

// src/lib/stores/calculator.ts
export const calculatorStore = writable<CalculatorData | null>(null);
```

## Implementation Plan by Route

### 1. Home Page (`/`)

**Components:**
- SearchForm
- CreateTributeForm
- SlugPreview

**Functionality:**
- Text search input with Search and Create buttons
- When Create is clicked, expand form to collect full name, phone, email
- Generate and display slugified URL
- Submit form data to server and redirect to new tribute page
- Form validation with clear error messages

### 2. Funeral Director Form (`/fd-form`)

**Components:**
- DirectorInfoForm
- FamilyMemberForm
- DeceasedInfoForm
- MemorialDetailsForm
- PaymentOptionsPanel

**Functionality:**
- Multi-step form for funeral directors to submit data
- Generate custom tribute link based on deceased's name
- Present payment options (Pay Now/Pay Later)
- Direct to appropriate next step based on selection
- Save form data to server and store

### 3. Booking Calculator (`/booking-calculator`)

**Components:**
- PackageSelector
- ScheduleSelector
- LocationForm
- DurationSelector
- CartSummary
- PaymentOptions

**Functionality:**
- Select service package
- Configure memorial schedule and location
- Calculate costs in real-time
- Provide "Save and Pay Now" and "Save and Pay Later" options
- Persist selections in store and server

### 4. Checkout Page (`/checkout`)

**Components:**
- OrderSummary
- PaymentMethodSelector
- CreditCardForm
- ConfirmationDisplay

**Functionality:**
- Show order summary
- Accept payment information
- Process payment through API
- Display confirmation or error
- Redirect to family dashboard on completion

### 5. Family Dashboard (`/family-dashboard`)

**Components:**
- Dashboard
- StatusPanel
- ActionButtons
- ScheduleDisplay
- MediaGallery (placeholder)

**Functionality:**
- Secure login
- Display tribute status and details
- Provide four action buttons (Upload Media, Edit Schedule, Transfer POC, Invite Contributors)
- Functional "Edit Schedule" button routing to booking calculator
- Placeholder pages for non-functional buttons

### 6. Tribute Page (`/celebration-of-life-for-[slug]`)

**Components:**
- TributeHeader
- MemorialDetails
- MediaDisplay
- ServiceInformation

**Functionality:**
- Display tribute information
- Show memorial service details
- Display uploaded media when available
- Provide links for contributors

## API Integration

- Copy all existing API endpoints from `/api/` directory
- Maintain compatibility with existing backend services
- Implement type-safe API interaction helpers
- Add proper error handling and loading states

## Implementation Priority

1. **Core Data Types and Stores**
   - Define all TypeScript interfaces
   - Set up store structure
   - Create API interaction helpers

2. **Home Page and Tribute Creation**
   - Implement search functionality
   - Build tribute creation form
   - Set up slug generation and redirect logic

3. **Funeral Director Workflow**
   - Build multi-step form
   - Implement payment option selection
   - Create confirmation flow

4. **Booking Calculator**
   - Build package selection interface
   - Implement scheduling functionality
   - Create cart and payment options

5. **Payment Processing**
   - Build checkout page
   - Implement payment form
   - Create confirmation displays

6. **Family Dashboard**
   - Build dashboard layout
   - Implement schedule display
   - Create action buttons and routing

## Testing Strategy

- Unit tests for utility functions and stores
- Component tests for UI elements
- Integration tests for form submissions
- E2E tests for critical user flows

## Migration Strategy

Once the rebuilt components are ready:

1. Test in isolation
2. Integrate with existing codebase
3. Run parallel for critical features
4. Switch routing to new implementations
5. Gather feedback and iterate
6. Complete full transition

## Timeline Estimates

- Initial setup and data types: 1 week
- Core functionality (Home, FD Form, Calculator): 2 weeks
- Secondary functionality (Checkout, Dashboard): 2 weeks
- Testing and refinement: 1 week
- Migration and deployment: 1 week

Total estimated time: 7 weeks

## Conclusion

This rebuild plan provides a structured approach to modernizing the Tribute platform while maintaining all existing functionality. By focusing on clean architecture, type safety, and efficient state management, the rebuilt application will be more maintainable, scalable, and ready for future enhancements.
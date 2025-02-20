# User Metadata Page Architecture Plan

## 1. Current Architecture Analysis

### Data Structure Overview
The system currently maintains user metadata through WordPress with the following key characteristics:
- Stored in WordPress database as user metadata
- Accessible via REST API endpoints
- JWT-authenticated access
- Structured data storage using meta_key/meta_value pairs

### Existing Data Types
1. Memorial Form Data
   ```typescript
   interface MemorialFormData {
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
   }
   ```

2. Calculator Data
   ```typescript
   interface CalculatorData {
     scheduleDays: ScheduleDay[];
     cartItems: CartItem[];
     cartTotal: number;
     selectedPackage: string;
     personalDetails: PersonalDetails;
   }
   ```

## 2. New Page Design Architecture

### Data Integration Strategy

1. **Data Fetching**
   ```typescript
   // Server-side load function
   export const load = async ({ cookies, fetch }) => {
     const token = cookies.get('jwt_token');
     const userId = cookies.get('user_id');
     
     // Fetch all user metadata
     const metaData = await fetch('/api/user-meta', {
       headers: {
         'Authorization': `Bearer ${token}`
       }
     });
     
     return {
       userData: metaData
     };
   };
   ```

2. **State Management**
   ```typescript
   // Client-side state using Svelte 5 runes
   let memorialData = $state<MemorialFormData | null>(null);
   let calculatorData = $state<CalculatorData | null>(null);
   
   // Derived state for combined data presentation
   let combinedUserData = $derived(() => {
     if (!memorialData || !calculatorData) return null;
     
     return {
       personalInfo: {
         name: `${memorialData.director.firstName} ${memorialData.director.lastName}`,
         contact: memorialData.contact
       },
       memorialDetails: {
         deceased: memorialData.deceased,
         schedule: calculatorData.scheduleDays,
         package: calculatorData.selectedPackage
       },
       pricing: {
         items: calculatorData.cartItems,
         total: calculatorData.cartTotal
       }
     };
   });
   ```

### Component Structure

1. **Page Layout**
   ```typescript
   // +page.svelte structure
   <script lang="ts">
     import { UserInfoPanel } from '$lib/components/user/UserInfoPanel.svelte';
     import { MemorialDetailsPanel } from '$lib/components/memorial/MemorialDetailsPanel.svelte';
     import { PricingPanel } from '$lib/components/pricing/PricingPanel.svelte';
   </script>
   ```

2. **Component Hierarchy**
   ```
   UserMetadataPage
   ├── UserInfoPanel
   │   ├── PersonalDetails
   │   └── ContactInformation
   ├── MemorialDetailsPanel
   │   ├── DeceasedInformation
   │   ├── ScheduleTimeline
   │   └── PackageDetails
   └── PricingPanel
       ├── CartItemsList
       └── TotalCalculation
   ```

### Data Flow Architecture

1. **Initial Load**
   - Server-side data fetching
   - State initialization
   - Component population

2. **Updates and Persistence**
   - Real-time state updates using runes
   - Automatic persistence to WordPress
   - Optimistic UI updates

## 3. Implementation Guidelines

### Data Access Patterns

1. **Metadata Retrieval**
   ```typescript
   // Utility function for metadata access
   const getUserMetadata = async (key: string): Promise<any> => {
     const response = await fetch(`/api/user-meta/${key}`);
     return response.json();
   };
   ```

2. **Data Transformation**
   ```typescript
   // Transform raw metadata into structured format
   const transformMetadata = (rawData: any[]): UserMetadata => {
     return rawData.reduce((acc, item) => {
       acc[item.meta_key] = JSON.parse(item.meta_value);
       return acc;
     }, {});
   };
   ```

### Security Considerations

1. **Authentication**
   - JWT token validation
   - Protected route implementation
   - Role-based access control

2. **Data Protection**
   - Input sanitization
   - Output encoding
   - HTTPS enforcement

### Performance Optimization

1. **State Management**
   - Minimal state updates
   - Memoized calculations
   - Efficient data structures

2. **Loading Strategy**
   - Progressive data loading
   - Skeleton loading states
   - Cached data utilization

## 4. Technical Specifications

### Required Types

```typescript
interface UserMetadata {
  memorial_form_data: MemorialFormData;
  calculator_data: CalculatorData;
  [key: string]: any;
}

interface UserMetadataPageData {
  personalInfo: {
    name: string;
    contact: {
      email: string;
      phone: string;
    };
  };
  memorialDetails: {
    deceased: {
      name: string;
      dob: string;
      dateOfPassing: string;
    };
    schedule: ScheduleDay[];
    package: string;
  };
  pricing: {
    items: CartItem[];
    total: number;
  };
}
```

### API Integration

1. **Endpoints**
   - GET /api/user-meta
   - GET /api/user-meta/:key
   - PUT /api/user-meta/:key

2. **Error Handling**
   ```typescript
   interface ApiError {
     code: string;
     message: string;
     status: number;
   }
   ```

## 5. Future Considerations

1. **Enhanced Features**
   - Real-time updates
   - Data export functionality
   - Advanced filtering and search
   - Timeline visualization

2. **Technical Improvements**
   - Caching strategy
   - WebSocket integration
   - Enhanced type safety
   - Performance monitoring

## 6. Development Workflow

1. **Implementation Steps**
   - Create base page structure
   - Implement data fetching
   - Build core components
   - Add state management
   - Implement persistence
   - Add error handling
   - Optimize performance

2. **Testing Strategy**
   - Unit tests for utilities
   - Component testing
   - Integration testing
   - E2E testing
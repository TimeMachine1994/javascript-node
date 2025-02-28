# UserMetaStore Implementation Summary

## Overview

This document summarizes the complete implementation plan for the `userMetaStore` utility module and its integration with SvelteKit's layout server. This implementation creates a robust, type-safe solution for managing user metadata in the TributestreamMegaMerge application.

## Documentation Map

This implementation is covered across multiple documents:

1. **[Implementation Plan](./implementation-plan.md)** - High-level overview and goals
2. **[Detailed Implementation](./userMetaStore-implementation.md)** - Specific code implementation details
3. **[Architecture Design](./userMetaStore-architecture.md)** - Architectural patterns and benefits
4. **[Migration Strategy](./userMetaStore-migration-strategy.md)** - How to migrate existing code

## Key Features

The userMetaStore implementation provides:

- **Single Source of Truth** - Centralized store for all user metadata
- **Type Safety** - Comprehensive TypeScript interfaces for all data
- **Efficient Caching** - Time-based caching with configurable invalidation
- **Error Handling** - Robust error handling with fallback values
- **SvelteKit Integration** - Seamless integration with SvelteKit's layout system

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        Client Browser                           │
│                                                                 │
│  ┌─────────────────┐      ┌─────────────────┐                   │
│  │                 │      │                 │                   │
│  │  SvelteKit UI   │◄────►│  userMetaStore  │                   │
│  │                 │      │    (Client)     │                   │
│  └─────────────────┘      └─────────────────┘                   │
│                                    │                            │
└────────────────────────────────────┼────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                          SvelteKit Server                       │
│                                                                 │
│  ┌─────────────────┐      ┌─────────────────┐                   │
│  │                 │      │                 │                   │
│  │ +layout.server  │◄────►│  userMetaStore  │                   │
│  │                 │      │    (Server)     │                   │
│  └─────────────────┘      └─────────────────┘                   │
│         ▲                        │                              │
│         │                        │                              │
│  ┌─────────────────┐             │                              │
│  │                 │             │                              │
│  │  hooks.server   │             │                              │
│  │                 │             │                              │
│  └─────────────────┘             │                              │
│                                  │                              │
└──────────────────────────────────┼──────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       WordPress Backend                         │
│                                                                 │
│  ┌─────────────────┐      ┌─────────────────┐                   │
│  │                 │      │                 │                   │
│  │  WP REST API    │◄────►│  User Metadata  │                   │
│  │                 │      │                 │                   │
│  └─────────────────┘      └─────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Authentication** - User logs in, setting JWT token and user cookie
2. **Server Initialization**
   - `hooks.server.ts` extracts token from cookies, sets in `event.locals`
   - `+layout.server.ts` calls `getUserMetadata()` function
   - Function fetches user metadata if not already cached
   - All routes inherit this data through SvelteKit's layout inheritance
3. **Client Interaction**
   - Components can access data through `$page.data`
   - Direct store subscription for reactive updates
   - Updates flow back to the WordPress API through the `updateUserMeta()` method

## Interface Map

The implementation provides several interfaces for accessing user metadata:

```
┌────────────────────────────────────────────┐
│                                            │
│             userMetaStore                  │
│                                            │
│  ┌────────────────┐    ┌────────────────┐  │
│  │                │    │                │  │
│  │  Store State   │    │   Methods      │  │
│  │                │    │                │  │
│  └────────────────┘    └────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
┌─────────────────┐  ┌─────────────────┐
│                 │  │                 │
│  Layout Data    │  │  Direct Access  │
│                 │  │                 │
└─────────────────┘  └─────────────────┘
        │                    │
        ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│                 │  │                 │
│     Routes      │  │   Components    │
│                 │  │                 │
└─────────────────┘  └─────────────────┘
```

## Key Implementation Details

### Store State

```typescript
interface UserMetaStoreState {
  isLoading: boolean;
  error: ApiError | null;
  metadataMap: Map<string, UserMetadata>;
  wpUserDataMap: Map<string, WPUserData>;
  lastFetched: Map<string, number>;
  initialized: boolean;
}
```

### Core Methods

```typescript
// Core store methods
{
  // Fetch user metadata from API
  fetchUserMeta(userId: string, token: string, forceRefresh?: boolean): Promise<UserMetadata>;
  
  // Update user metadata
  updateUserMeta(userId: string, token: string, key: string, value: any): Promise<boolean>;
  
  // Get a specific property with type safety
  getUserProperty<T>(userId: string, path: string, defaultValue: T): T;
  
  // Get all user metadata
  getUserMetadata(userId: string): UserMetadata | null;
  
  // Get WordPress user data
  getWpUserData(userId: string): WPUserData | null;
  
  // Clear store state
  clear(): void;
}
```

### Utility Functions

```typescript
// Utility function for server load functions
export async function getUserMetadata(userId: string, token: string) {
  // Implementation that fetches user metadata
  // Returns { userData: UserMetadata[], wpUserData: WPUserData }
}

// Derived stores for reactive state
export const isLoadingUserMeta = derived(...);
export const userMetaError = derived(...);
```

## Type Hierarchy

```
UserMetadata
  ├─ memorial_form_data: MemorialFormData
  │    ├─ director: { firstName, lastName }
  │    ├─ familyMember: { name, dob }
  │    ├─ deceased: { name, dob, dateOfPassing }
  │    ├─ contact: { email, phone }
  │    └─ memorial: { location, date, time }
  │
  ├─ calculator_data: CalculatorData
  │    ├─ meta: { status, lastUpdated, version, errors? }
  │    ├─ scheduleDays: ScheduleDay[]
  │    │    └─ locations: Location[]
  │    ├─ selectedPackage: Package
  │    ├─ cart: CartData
  │    │    ├─ items: CartItem[]
  │    │    ├─ discounts: { code, amount }[]
  │    │    └─ taxes: { name, rate, amount }[]
  │    │
  │    └─ personalDetails: PersonalDetails
  │
  └─ user_id?: string
```

## API Integration

### Fetching Data

```typescript
// In a store method
const response = await fetch(`/api/user-meta?user_id=${userId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Process response and update store
```

### Updating Data

```typescript
// In a store method
const response = await fetch('/api/user-meta', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: userId,
    meta_key: metaKey,
    meta_value: serializedValue
  })
});

// Process response and update local cache
```

## Layout Server Integration

```typescript
// In +layout.server.ts
import { getUserMetadata } from '$lib/stores/userMetaStore';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get('jwt_token');
  const userCookie = cookies.get('user');
  
  // Default response for unauthenticated users
  if (!token || !userCookie) {
    return { userData: [], wpUserData: undefined /* other defaults */ };
  }
  
  try {
    // Parse user cookie to get user ID
    const parsedWPUserData = JSON.parse(userCookie);
    const userId = parsedWPUserData.metaResult?.user_id.toString();
    
    if (!userId) return { userData: [], wpUserData: undefined /* other defaults */ };
    
    // Use the userMetaStore to get all metadata
    const result = await getUserMetadata(userId, token);
    
    // Return data for all routes
    return {
      userData: result.userData,
      wpUserData: result.wpUserData,
      // Other derived properties
    };
  } catch (error) {
    console.error('Error in layout.server.ts:', error);
    return { userData: [], wpUserData: undefined /* other defaults */ };
  }
};
```

## Usage Examples

### Server-Side

```typescript
// In a page server load function
import { getUserMetadata } from '$lib/stores/userMetaStore';

export const load = async ({ cookies, params }) => {
  const token = cookies.get('jwt_token');
  const userId = params.userId;
  
  const { userData } = await getUserMetadata(userId, token);
  
  return {
    pageData: {
      userName: userData[0]?.memorial_form_data.familyMember.name,
      memorialDate: userData[0]?.memorial_form_data.memorial.date
    }
  };
};
```

### Client-Side

```svelte
<script>
  import { page } from '$app/stores';
  import { userMetaStore } from '$lib/stores/userMetaStore';
  
  // From layout data
  $: userData = $page.data.userData?.[0];
  
  // Direct store access
  $: userId = $page.data.wpUserData?.metaResult?.user_id.toString();
  $: memorialLocation = userId 
    ? userMetaStore.getUserProperty(
        userId, 
        'memorial_form_data.memorial.location', 
        'Unknown location'
      )
    : 'Unknown location';
</script>

<h1>Memorial Service</h1>
{#if userData}
  <p>For: {userData.memorial_form_data.deceased.name}</p>
  <p>Date: {userData.memorial_form_data.memorial.date}</p>
  <p>Location: {memorialLocation}</p>
{:else}
  <p>No memorial information available</p>
{/if}
```

## Next Steps

After completing the implementation as outlined in the detailed documents, the next steps are:

1. **Review** - Team code review of the implementation
2. **Testing** - Comprehensive testing of the new features
3. **Migration** - Begin migrating existing components to use the new store
4. **Monitoring** - Add performance monitoring to verify improvements
5. **Documentation** - Finalize developer documentation for future maintenance

## Conclusion

The `userMetaStore` implementation provides a robust solution for managing user metadata in the TributestreamMegaMerge application. By centralizing this functionality and providing type-safe interfaces, it significantly improves maintainability, performance, and developer experience.

The detailed implementation plan, architecture design, and migration strategy documents provide comprehensive guidance for implementing and adopting this solution throughout the application.
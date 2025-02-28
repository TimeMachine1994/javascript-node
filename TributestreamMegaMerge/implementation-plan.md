# UserMetaStore Implementation Plan

## Overview

The `userMetaStore.ts` module will be a comprehensive utility that:

1. Serves as a single source of truth for user metadata
2. Provides type-safe access to user properties
3. Efficiently caches data to minimize API calls
4. Handles authentication states
5. Integrates with the existing layout.server.ts file

## Type Definitions

We'll need to create several interfaces specifically for the userMetaStore:

```typescript
// API-related interfaces
interface UserMetaApiResponse {
  success: boolean;
  message: string;
  user_id: number;
  meta_key: string;
  meta_value: string;
  version?: string;
}

// Store state interface
interface UserMetaStoreState {
  isLoading: boolean;
  error: string | null;
  userMetadata: UserMetadata | null;
  wpUserData: WPUserData | null;
  lastFetched: number | null;
  initialized: boolean;
}

// Cache configuration
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate: boolean;
}
```

## Store Implementation

The store will use Svelte's writable store with additional methods:

```typescript
// Store creation function
function createUserMetaStore() {
  const initialState: UserMetaStoreState = {
    isLoading: false,
    error: null,
    userMetadata: null,
    wpUserData: null,
    lastFetched: null,
    initialized: false
  };
  
  const { subscribe, set, update } = writable<UserMetaStoreState>(initialState);
  
  // Methods for:
  // - fetchUserMeta: Get all user metadata
  // - fetchSingleMeta: Get a specific metadata key
  // - updateUserMeta: Update a single metadata key
  // - getUserProperty: Access a specific property
  // - clear: Reset store state
  
  return {
    subscribe,
    fetchUserMeta,
    updateUserMeta,
    getUserProperty,
    clear
  };
}
```

## Caching Strategy

We'll implement a time-based caching mechanism:

1. Track the timestamp of the last successful data fetch
2. Check the age of cached data before making new requests
3. Support "stale-while-revalidate" pattern for responsive UX
4. Cache individual metadata items separately for granular control

## API Integration

The store will interact with the API endpoints:

```typescript
async function fetchUserMeta(userId: string, token: string) {
  // 1. Check cache first
  // 2. Make API request if necessary
  // 3. Process response
  // 4. Update store state
  // 5. Handle errors
}

async function updateUserMeta(userId: string, token: string, key: string, value: any) {
  // 1. Serialize value if needed
  // 2. Make API request
  // 3. Update local cache
  // 4. Handle errors
}
```

## Authentication Handling

The store will:

1. Accept authentication tokens as parameters to API methods
2. Detect authentication state changes
3. Clear or refresh cache based on auth state
4. Provide fallback values for unauthenticated states

## Layout Server Integration

The updated `+layout.server.ts` will:

```typescript
import { getUserMetadata } from '$lib/stores/userMetaStore';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get('jwt_token');
  const userId = cookies.get('user_id');
  
  // Handle case where user is not authenticated
  if (!token || !userId) {
    return { userData: [], wpUserData: null };
  }
  
  try {
    // Use the new userMetaStore to get all metadata
    const result = await getUserMetadata(userId, token);
    
    // Transform data for routes if needed
    return {
      userData: result.userData,
      wpUserData: result.wpUserData,
      // Add more destructured properties as needed
    };
  } catch (error) {
    // Handle errors with fallback values
  }
};
```

## Error Handling Strategy

1. Each API function will include comprehensive error handling
2. The store will maintain an error state property
3. The layout server will provide fallback values for any errors
4. Consumers can subscribe to error state changes

## Implementation Steps

1. Create the `userMetaStore.ts` file with initial type definitions
2. Implement the store with basic functionality
3. Add API interaction methods
4. Implement caching mechanisms
5. Add authentication handling
6. Update the layout server to use the new store
7. Test and refine

## Testing Considerations

The implementation should be tested for:
- Correct type handling
- Proper error handling
- Caching behavior
- Authentication flow
- Performance under various conditions
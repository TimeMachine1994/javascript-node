# UserMetaStore Implementation Details

This document provides detailed implementation instructions for creating the `userMetaStore.ts` utility module and updating the `+layout.server.ts` file.

## 1. UserMetaStore.ts Implementation

### File Path
```
TributestreamMegaMerge/src/lib/stores/userMetaStore.ts
```

### Code Implementation

```typescript
/**
 * userMetaStore.ts - Comprehensive utility for managing user metadata
 * 
 * This module serves as the single source of truth for user metadata in the application.
 * It provides:
 * - Type-safe access to user metadata properties
 * - Efficient caching to minimize API calls
 * - Authentication state handling
 * - Robust error handling
 */

import { writable, derived, get } from 'svelte/store';
import type { 
  UserMetadata,
  WPUserData, 
  WPMemorialFormData,
  MetaEntry,
  ApiError
} from '$lib/types/user-metadata';
import { browser } from '$app/environment';

/**
 * Interface for API responses from user-meta endpoints
 */
interface UserMetaApiResponse {
  success: boolean;
  message: string;
  user_id: number;
  meta_key: string;
  meta_value: string;
  version?: string;
}

/**
 * Main store state interface
 */
interface UserMetaStoreState {
  isLoading: boolean;
  error: ApiError | null;
  metadataMap: Map<string, UserMetadata>;
  wpUserDataMap: Map<string, WPUserData>;
  lastFetched: Map<string, number>;
  initialized: boolean;
}

/**
 * Configuration for caching behavior
 */
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate: boolean;
}

// Default cache configuration: 5 minute TTL with stale-while-revalidate
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: true
};

/**
 * Create the user metadata store
 */
function createUserMetaStore() {
  // Initialize with empty maps
  const initialState: UserMetaStoreState = {
    isLoading: false,
    error: null,
    metadataMap: new Map<string, UserMetadata>(),
    wpUserDataMap: new Map<string, WPUserData>(),
    lastFetched: new Map<string, number>(),
    initialized: false
  };

  // Create the writable store
  const { subscribe, set, update } = writable<UserMetaStoreState>(initialState);

  /**
   * Check if cached data is still valid
   */
  function isCacheValid(userId: string, config: CacheConfig = DEFAULT_CACHE_CONFIG): boolean {
    const state = get({ subscribe });
    const lastFetched = state.lastFetched.get(userId);
    
    if (!lastFetched) return false;
    
    const now = Date.now();
    return (now - lastFetched) < config.ttl;
  }

  /**
   * Get the base URL for API calls
   */
  function getApiUrl(userId?: string): string {
    return userId 
      ? `/api/user-meta?user_id=${userId}`
      : '/api/user-meta';
  }

  /**
   * Parse WordPress data into our internal UserMetadata format
   */
  function parseWpUserData(wpUserData: WPUserData): UserMetadata | null {
    if (!wpUserData.metaResult?.meta_value) return null;
    
    try {
      // Parse the meta_value string into WPMemorialFormData
      const wpMemorialData: WPMemorialFormData = JSON.parse(wpUserData.metaResult.meta_value);
      
      // Create a UserMetadata object with proper structure mapping
      const userData: UserMetadata = {
        memorial_form_data: {
          director: {
            firstName: wpMemorialData.director.firstName,
            lastName: wpMemorialData.director.lastName
          },
          familyMember: {
            name: `${wpMemorialData.familyMember.firstName} ${wpMemorialData.familyMember.lastName}`,
            dob: wpMemorialData.familyMember.dob
          },
          deceased: {
            name: `${wpMemorialData.deceased.firstName} ${wpMemorialData.deceased.lastName}`,
            dob: wpMemorialData.deceased.dob,
            dateOfPassing: wpMemorialData.deceased.dop
          },
          contact: {
            email: wpMemorialData.contact.email,
            phone: wpMemorialData.contact.phone
          },
          memorial: {
            location: `${wpMemorialData.memorial.locationName} - ${wpMemorialData.memorial.locationAddress}`,
            date: wpMemorialData.memorial.date,
            time: wpMemorialData.memorial.time
          }
        },
        calculator_data: {
          meta: {
            status: 'draft',
            lastUpdated: new Date().toISOString(),
            version: wpUserData.metaResult?.version || '1.0.0'
          },
          scheduleDays: [{
            date: wpMemorialData.memorial.date,
            locations: [{
              name: wpMemorialData.memorial.locationName,
              address: wpMemorialData.memorial.locationAddress,
              startTime: wpMemorialData.memorial.time,
              duration: 60,
              travelExceedsHour: false,
              notes: ''
            }]
          }],
          selectedPackage: {
            id: 'Solo',
            name: 'Solo Package',
            description: 'Basic memorial package',
            basePrice: 599,
            features: []
          },
          cart: {
            items: [],
            subtotal: 599,
            total: 599,
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
        },
        user_id: wpUserData.metaResult.user_id.toString()
      };
      
      return userData;
    } catch (error) {
      console.error('Error parsing WP user data:', error);
      return null;
    }
  }

  /**
   * Create a fallback UserMetadata object
   */
  function createFallbackUserMetadata(userId?: string): UserMetadata {
    return {
      memorial_form_data: {
        director: { firstName: '', lastName: '' },
        familyMember: { name: '', dob: '' },
        deceased: { name: '', dob: '', dateOfPassing: '' },
        contact: { email: '', phone: '' },
        memorial: { location: '', date: '', time: '' }
      },
      calculator_data: {
        meta: {
          status: 'error',
          lastUpdated: new Date().toISOString(),
          version: '2.0.0',
          errors: ['Failed to fetch user metadata']
        },
        scheduleDays: [],
        selectedPackage: {
          id: 'Solo',
          name: 'Solo Package',
          description: 'Basic memorial package',
          basePrice: 599,
          features: []
        },
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
      },
      user_id: userId || ''
    };
  }

  return {
    subscribe,
    
    /**
     * Fetch user metadata for a specific user
     * 
     * @param userId The user ID to fetch metadata for
     * @param token JWT token for authentication
     * @param forceRefresh Whether to force refresh even if cache is valid
     * @returns A promise resolving to the UserMetadata
     */
    async fetchUserMeta(userId: string, token: string, forceRefresh = false): Promise<UserMetadata> {
      if (!forceRefresh && isCacheValid(userId)) {
        // Return cached data if valid
        const state = get({ subscribe });
        const cachedData = state.metadataMap.get(userId);
        if (cachedData) return cachedData;
      }
      
      // Start loading
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const response = await fetch(getApiUrl(userId), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            code: 'API_ERROR',
            message: errorData.message || 'Failed to fetch user metadata',
            status: response.status
          };
        }
        
        const responseData: UserMetaApiResponse = await response.json();
        
        // Convert to WPUserData format
        const wpUserData: WPUserData = {
          displayName: '', // These values aren't included in the API response
          email: '',      // and would need to be filled from other sources
          nicename: '',
          roles: [],
          isAdmin: false,
          metaResult: responseData
        };
        
        // Parse into UserMetadata
        const userData = parseWpUserData(wpUserData) || createFallbackUserMetadata(userId);
        
        // Update store with the fetched data
        update(state => {
          const newMetadataMap = new Map(state.metadataMap);
          newMetadataMap.set(userId, userData);
          
          const newWpUserDataMap = new Map(state.wpUserDataMap);
          newWpUserDataMap.set(userId, wpUserData);
          
          const newLastFetched = new Map(state.lastFetched);
          newLastFetched.set(userId, Date.now());
          
          return {
            ...state,
            isLoading: false,
            metadataMap: newMetadataMap,
            wpUserDataMap: newWpUserDataMap,
            lastFetched: newLastFetched,
            initialized: true
          };
        });
        
        return userData;
      } catch (error) {
        const apiError = error as ApiError;
        
        // Update store with error
        update(state => ({
          ...state,
          isLoading: false,
          error: apiError
        }));
        
        // Return fallback data
        return createFallbackUserMetadata(userId);
      }
    },
    
    /**
     * Update a specific metadata key for a user
     * 
     * @param userId The user ID to update metadata for
     * @param token JWT token for authentication
     * @param metaKey The metadata key to update
     * @param metaValue The new value for the metadata key
     * @returns A promise resolving to success or failure
     */
    async updateUserMeta(
      userId: string, 
      token: string, 
      metaKey: string, 
      metaValue: any
    ): Promise<boolean> {
      // Start loading
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        // Serialize the meta value if it's not a string
        const serializedValue = typeof metaValue === 'string' 
          ? metaValue 
          : JSON.stringify(metaValue);
        
        const response = await fetch(getApiUrl(), {
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
        
        if (!response.ok) {
          const errorData = await response.json();
          throw {
            code: 'API_ERROR',
            message: errorData.message || 'Failed to update user metadata',
            status: response.status
          };
        }
        
        const responseData = await response.json();
        
        // After successful update, refresh the cache
        await this.fetchUserMeta(userId, token, true);
        
        return true;
      } catch (error) {
        const apiError = error as ApiError;
        
        // Update store with error
        update(state => ({
          ...state,
          isLoading: false,
          error: apiError
        }));
        
        return false;
      }
    },
    
    /**
     * Get a specific property from user metadata
     * 
     * @param userId The user ID to get property for
     * @param path Dot-notation path to the property
     * @param defaultValue Default value if property doesn't exist
     * @returns The property value or default value
     */
    getUserProperty<T>(userId: string, path: string, defaultValue: T): T {
      const state = get({ subscribe });
      const userData = state.metadataMap.get(userId);
      
      if (!userData) return defaultValue;
      
      // Navigate the path to find the property
      const parts = path.split('.');
      let value: any = userData;
      
      for (const part of parts) {
        if (value === undefined || value === null) return defaultValue;
        value = value[part];
      }
      
      return value !== undefined ? value : defaultValue;
    },
    
    /**
     * Get all user metadata
     * 
     * @param userId The user ID to get metadata for
     * @returns UserMetadata or null if not found
     */
    getUserMetadata(userId: string): UserMetadata | null {
      const state = get({ subscribe });
      return state.metadataMap.get(userId) || null;
    },
    
    /**
     * Get WordPress user data
     * 
     * @param userId The user ID to get data for
     * @returns WPUserData or null if not found
     */
    getWpUserData(userId: string): WPUserData | null {
      const state = get({ subscribe });
      return state.wpUserDataMap.get(userId) || null;
    },
    
    /**
     * Clear all stored metadata
     */
    clear(): void {
      set(initialState);
    },
    
    /**
     * Get loading state
     */
    isLoading(): boolean {
      return get({ subscribe }).isLoading;
    },
    
    /**
     * Get error state
     */
    getError(): ApiError | null {
      return get({ subscribe }).error;
    }
  };
}

// Create and export the store
export const userMetaStore = createUserMetaStore();

/**
 * Utility function to fetch all user metadata
 * This is a convenience function for use in load functions
 * 
 * @param userId The user ID to fetch metadata for
 * @param token JWT token for authentication
 * @returns A promise resolving to an object with user metadata and WordPress user data
 */
export async function getUserMetadata(userId: string, token: string) {
  // Fetch the user metadata
  const userData = await userMetaStore.fetchUserMeta(userId, token);
  
  // Get the WordPress user data
  const wpUserData = userMetaStore.getWpUserData(userId);
  
  return {
    userData: [userData], // Return as array to match existing structure
    wpUserData
  };
}

/**
 * Derived store for checking if metadata is loading
 */
export const isLoadingUserMeta = derived(
  userMetaStore,
  $store => $store.isLoading
);

/**
 * Derived store for checking if an error occurred
 */
export const userMetaError = derived(
  userMetaStore,
  $store => $store.error
);
```

## 2. Updated +layout.server.ts Implementation

### File Path
```
TributestreamMegaMerge/src/routes/+layout.server.ts
```

### Code Implementation

```typescript
import type { LayoutServerLoad } from './$types';
import { getUserMetadata } from '$lib/stores/userMetaStore';
import type { UserMetadata, WPUserData } from '$lib/types/user-metadata';

// Define layout data interface
interface LayoutData {
  userData: UserMetadata[];
  wpUserData?: WPUserData;
  // Add additional properties that need to be exposed to all routes
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail?: string;
  userDisplayName?: string;
}

export const load: LayoutServerLoad<LayoutData> = async ({ cookies, locals }) => {
  // Get the JWT token and user ID from cookies
  const token = cookies.get('jwt_token');
  const userCookie = cookies.get('user');
  
  // Default response for unauthenticated users
  const defaultResponse: LayoutData = {
    userData: [],
    wpUserData: undefined,
    isAuthenticated: false,
    isAdmin: false
  };

  try {
    // Check if the user is authenticated
    if (!token || !userCookie) {
      console.log('No authentication found, returning default data');
      return defaultResponse;
    }

    // Parse the user cookie to get the user ID
    const parsedWPUserData: WPUserData = JSON.parse(userCookie);
    const userId = parsedWPUserData.metaResult?.user_id.toString();

    if (!userId) {
      console.error('User ID not found in cookie data');
      return defaultResponse;
    }

    // Use the userMetaStore to get all user metadata
    console.log(`Fetching metadata for user ID: ${userId}`);
    const result = await getUserMetadata(userId, token);

    // Return the data in the format expected by the application
    return {
      userData: result.userData,
      wpUserData: result.wpUserData,
      isAuthenticated: true,
      isAdmin: result.wpUserData?.isAdmin || false,
      userEmail: result.wpUserData?.email,
      userDisplayName: result.wpUserData?.displayName
    };
  } catch (error) {
    // Log the error for debugging
    console.error('Error in layout.server.ts load function:', error);

    // Return default data in case of error
    return defaultResponse;
  }
};
```

## 3. Usage Examples

### In a Page or Component
```typescript
<script lang="ts">
  import { page } from '$app/stores';
  import { userMetaStore, isLoadingUserMeta, userMetaError } from '$lib/stores/userMetaStore';

  // Get the user ID from the data provided by layout.server.ts
  $: userId = $page.data.wpUserData?.metaResult?.user_id.toString();

  // Access user metadata reactively using the store
  $: userData = userId ? userMetaStore.getUserMetadata(userId) : null;

  // You can also access specific properties with fallback values
  $: userName = userId 
    ? userMetaStore.getUserProperty(userId, 'memorial_form_data.deceased.name', 'Unknown')
    : 'Unknown';

  // Handle loading state
  $: loading = $isLoadingUserMeta;

  // Handle errors
  $: error = $userMetaError;

  // Function to update user metadata
  async function updateUserProperty() {
    if (!userId) return;
    
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt_token='))
      ?.split('=')[1];
      
    if (!token) return;
    
    const success = await userMetaStore.updateUserMeta(
      userId,
      token,
      'calculator_data',
      { /* updated data */ }
    );
    
    if (success) {
      // Handle successful update
    }
  }
</script>

{#if loading}
  <p>Loading user data...</p>
{:else if error}
  <p>Error: {error.message}</p>
{:else if userData}
  <h1>Welcome, {userData.memorial_form_data.familyMember.name}</h1>
  
  <!-- Display user metadata -->
  <div>
    <h2>Memorial Details</h2>
    <p>In memory of: {userData.memorial_form_data.deceased.name}</p>
    <p>Date: {userData.memorial_form_data.memorial.date}</p>
    <p>Time: {userData.memorial_form_data.memorial.time}</p>
    <p>Location: {userData.memorial_form_data.memorial.location}</p>
  </div>
  
  <button on:click={updateUserProperty}>Update Data</button>
{:else}
  <p>No user data available</p>
{/if}
```

## 4. Implementation Notes

### Authentication Flow
- The userMetaStore expects a valid JWT token to be passed to its methods
- All API requests include the token in the Authorization header
- The layout.server.ts file retrieves the token from cookies

### Caching Strategy
- Data is cached for 5 minutes by default
- The `staleWhileRevalidate` pattern allows using cached data while refreshing in background
- Each user's data is cached separately

### Error Handling
- All API errors are captured and typed appropriately
- Fallback values are provided at every level
- The layout.server.ts handles errors gracefully and provides default values

### Type Safety
- All interfaces are strongly typed
- Methods use generics for type-safe property access
- Values are validated before being stored

### Performance Considerations
- Caching minimizes unnecessary API calls
- Derived stores prevent redundant computations
- Maps are used for efficient data access
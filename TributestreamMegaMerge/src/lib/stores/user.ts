import { writable, derived } from 'svelte/store';
import type { User, AuthState, UserMetadata } from '$lib/types/user';
import { browser } from '$app/environment';

/**
 * Initialize auth state from localStorage if available
 * @returns Initial auth state
 */
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

/**
 * Create a store for managing authentication state
 */
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
    
    /**
     * Set login state
     * @param user The user data
     * @param tokens The authentication tokens
     */
    login: (user: User, tokens: AuthState['tokens']) => set({
      isAuthenticated: true,
      user,
      tokens,
      error: undefined
    }),
    
    /**
     * Update user data
     * @param user The updated user data
     */
    updateUser: (user: User) => update(state => ({
      ...state,
      user
    })),
    
    /**
     * Set logout state
     */
    logout: () => set({
      isAuthenticated: false,
      user: null,
      tokens: undefined,
      error: undefined
    }),
    
    /**
     * Set error state
     * @param error The error message
     */
    setError: (error: string) => update(state => ({
      ...state,
      error
    }))
  };
};

/**
 * Create a store for managing user metadata
 */
const createUserMetadataStore = () => {
  const { subscribe, set, update } = writable<UserMetadata | null>(null);
  
  return {
    subscribe,
    set,
    
    /**
     * Update a specific metadata field
     * @param key The metadata key to update
     * @param value The new value
     */
    updateField: <K extends keyof UserMetadata>(
      key: K, 
      value: UserMetadata[K]
    ) => update(metadata => {
      if (!metadata) metadata = {};
      return { ...metadata, [key]: value };
    }),
    
    /**
     * Clear all metadata
     */
    clear: () => set(null)
  };
};

// Create and export the stores
export const authStore = createAuthStore();
export const userMetadataStore = createUserMetadataStore();

// Derived store for current user
export const currentUser = derived(authStore, $authStore => $authStore.user);
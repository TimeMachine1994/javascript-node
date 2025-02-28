import type { Readable } from 'svelte/store';
import type { UserMetadata, WPUserData, ApiError } from '$lib/types/user-metadata';

/**
 * Configuration for caching behavior
 */
export interface CacheConfig {
  /** Time to live in milliseconds */
  ttl: number;
  /** Whether to return stale data while fetching fresh data */
  staleWhileRevalidate: boolean;
}

/**
 * The userMetaStore is a reactive store for managing user metadata
 * It serves as a single source of truth for user metadata in the application
 */
export interface UserMetaStore extends Readable<{
  isLoading: boolean;
  error: ApiError | null;
  metadataMap: Map<string, UserMetadata>;
  wpUserDataMap: Map<string, WPUserData>;
  lastFetched: Map<string, number>;
  initialized: boolean;
}> {
  /**
   * Fetch user metadata for a specific user
   * 
   * @param userId The user ID to fetch metadata for
   * @param token JWT token for authentication
   * @param forceRefresh Whether to force refresh even if cache is valid
   * @returns A promise resolving to the UserMetadata
   */
  fetchUserMeta(userId: string, token: string, forceRefresh?: boolean): Promise<UserMetadata>;
  
  /**
   * Update a specific metadata key for a user
   * 
   * @param userId The user ID to update metadata for
   * @param token JWT token for authentication
   * @param metaKey The metadata key to update
   * @param metaValue The new value for the metadata key
   * @returns A promise resolving to success or failure
   */
  updateUserMeta(
    userId: string, 
    token: string, 
    metaKey: string, 
    metaValue: any
  ): Promise<boolean>;
  
  /**
   * Get a specific property from user metadata
   * 
   * @param userId The user ID to get property for
   * @param path Dot-notation path to the property
   * @param defaultValue Default value if property doesn't exist
   * @returns The property value or default value
   */
  getUserProperty<T>(userId: string, path: string, defaultValue: T): T;
  
  /**
   * Get all user metadata
   * 
   * @param userId The user ID to get metadata for
   * @returns UserMetadata or null if not found
   */
  getUserMetadata(userId: string): UserMetadata | null;
  
  /**
   * Get WordPress user data
   * 
   * @param userId The user ID to get data for
   * @returns WPUserData or null if not found
   */
  getWpUserData(userId: string): WPUserData | null;
  
  /**
   * Clear all stored metadata
   */
  clear(): void;
  
  /**
   * Get loading state
   */
  isLoading(): boolean;
  
  /**
   * Get error state
   */
  getError(): ApiError | null;
}

/**
 * Utility function to fetch all user metadata
 * This is a convenience function for use in load functions
 * 
 * @param userId The user ID to fetch metadata for
 * @param token JWT token for authentication
 * @returns A promise resolving to an object with user metadata and WordPress user data
 */
export function getUserMetadata(userId: string, token: string): Promise<{
  userData: UserMetadata[];
  wpUserData: WPUserData | null;
}>;

/**
 * Derived store for checking if metadata is loading
 */
export const isLoadingUserMeta: Readable<boolean>;

/**
 * Derived store for checking if an error occurred
 */
export const userMetaError: Readable<ApiError | null>;

/**
 * The singleton instance of the UserMetaStore
 */
export const userMetaStore: UserMetaStore;
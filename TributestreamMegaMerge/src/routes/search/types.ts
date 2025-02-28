import type { Tribute } from '$lib/types/tribute';

/**
 * Search page route params
 */
export interface SearchParams {
  /**
   * Search query parameter
   */
  q?: string;
}

/**
 * Search page data from server load function
 */
export interface SearchPageData {
  /**
   * Search query from URL
   */
  query: string;
  
  /**
   * Search results from API
   */
  results: Tribute[];
  
  /**
   * Error message if search failed
   */
  error?: string;
}
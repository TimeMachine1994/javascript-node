import { searchTributes, getMockTributes } from '$lib/api/tribute';
import type { SearchPageData, SearchParams } from './types';
import type { PageServerLoad } from './$types';

/**
 * Server load function for the search page
 * 
 * This function fetches search results based on the query parameter
 */
export const load = (async ({ url }) => {
  // Get search query from URL
  const query = url.searchParams.get('q') || '';
  
  try {
    let results = [];
    
    if (query) {
      // For development, use mock data
      // In production, we'd use the searchTributes API call
      results = getMockTributes(Math.ceil(Math.random() * 5));
      
      // You would use this in production:
      // results = await searchTributes(query);
    }
    
    return {
      query,
      results
    } satisfies SearchPageData;
  } catch (error) {
    console.error('Error in search page load function:', error);
    
    return {
      query,
      results: [],
      error: 'An error occurred while searching for tributes. Please try again.'
    } satisfies SearchPageData;
  }
}) satisfies PageServerLoad;
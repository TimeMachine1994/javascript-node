import type { PageServerLoad } from './$types';
import type { Tribute } from '$lib/types/api';

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    // Fetch featured tributes
    const response = await fetch('/api/tributes?page=1&per_page=6&featured=true');
    if (!response.ok) {
      throw new Error('Failed to fetch featured tributes');
    }
    
    const data = await response.json();
    const tributes: Tribute[] = data.tributes || [];

    return {
      featuredTributes: tributes,
      initialSearchResults: [] as Tribute[] // Empty initial search results
    };
  } catch (error) {
    console.error('Error loading featured tributes:', error);
    return {
      featuredTributes: [] as Tribute[],
      initialSearchResults: [] as Tribute[]
    };
  }
};
import type { PageServerLoad } from './$types';
import { getUserMetadata } from '$lib/stores/userMetaStore';

/**
 * Server load function for user metadata demo page
 * Demonstrates how to use the userMetaStore in a server context
 */
export const load: PageServerLoad = async ({ cookies, parent }) => {
  console.log('🚀 Starting load function for user-metadata-demo page');

  // Get data from the parent layout
  const parentData = await parent();
  console.log('👪 Got parent data:', {
    isAuthenticated: parentData.isAuthenticated,
    hasUserData: !!parentData.userData?.length,
    hasWpUserData: !!parentData.wpUserData
  });

  // Extract authentication info
  const isAuthenticated = parentData.isAuthenticated;
  const token = cookies.get('jwt_token');
  const userId = parentData.wpUserData?.metaResult?.user_id?.toString();

  // Default response
  const result: Record<string, any> = {
    pageTitle: 'User Metadata Demo',
    description: 'Demonstration of the userMetaStore utility',
    pageLoadTime: new Date().toISOString()
  };

  // If user is authenticated and we have tokens, fetch fresh metadata
  if (isAuthenticated && token && userId) {
    console.log(`🔍 Fetching fresh metadata for user ID: ${userId}`);
    
    try {
      // Use the userMetaStore to get metadata
      const freshData = await getUserMetadata(userId, token);
      console.log('✅ Fresh metadata fetched successfully');
      
      // Add to result
      result.freshUserData = freshData.userData;
      result.lastFetched = new Date().toISOString();
    } catch (error) {
      console.error('❌ Error fetching fresh metadata:', error);
      result.error = {
        message: error instanceof Error ? error.message : 'Unknown error fetching metadata',
        time: new Date().toISOString()
      };
    }
  } else {
    console.log('👤 Not authenticated or missing tokens/user ID');
  }

  console.log('🏁 Finished load function for user-metadata-demo page');
  return result;
};
import type { LayoutServerLoad } from './$types';
import { getUserMetadata } from '$lib/stores/userMetaStore';
import type { UserMetadata, WPUserData } from '$lib/types/user-metadata';

// Define layout data interface
interface LayoutData {
  userData: UserMetadata[];
  wpUserData?: WPUserData;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail?: string;
  userDisplayName?: string;
}

export const load: LayoutServerLoad<LayoutData> = async ({ cookies, locals }) => {
  console.log('🔄 Starting layout.server.ts load function');
  
  // Get the JWT token and user cookie
  const token = cookies.get('jwt_token');
  const userCookie = cookies.get('user');
  
  console.log('🍪 Token from cookies:', token ? 'Present' : 'Missing');
  
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
      console.log('🚫 No authentication found, returning default data');
      return defaultResponse;
    }

    // Parse the user cookie to get the user ID and data
    const parsedWPUserData: WPUserData = JSON.parse(userCookie);
    const userId = parsedWPUserData.metaResult?.user_id.toString();

    if (!userId) {
      console.error('❌ User ID not found in cookie data');
      return defaultResponse;
    }

    // Store the WordPress user data with admin flag
    const wpUserData: WPUserData = {
      displayName: parsedWPUserData.displayName,
      email: parsedWPUserData.email,
      nicename: parsedWPUserData.nicename,
      roles: parsedWPUserData.roles,
      isAdmin: parsedWPUserData.roles.includes('administrator'),
      metaResult: parsedWPUserData.metaResult
    };

    console.log(`👤 Fetching metadata for user ID: ${userId}`);
    
    // Use the userMetaStore to get all user metadata
    const result = await getUserMetadata(userId, token);
    
    console.log('✅ User metadata successfully retrieved');

    // Return the data in the format expected by the application
    return {
      userData: result.userData,
      wpUserData: wpUserData,
      isAuthenticated: true,
      isAdmin: wpUserData.isAdmin || false,
      userEmail: wpUserData.email,
      userDisplayName: wpUserData.displayName
    };
  } catch (error) {
    // Log the error for debugging
    console.error('💥 Error in layout.server.ts load function:', error);

    // Return default data in case of error
    return defaultResponse;
  }
};
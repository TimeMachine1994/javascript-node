import type { PageLoad } from './$types';
import { userMetaStore } from '$lib/stores/userMetaStore';
import type { UserMetadata, WPUserData } from '$lib/types/user-metadata';

/**
 * Interface for the return type of the load function
 */
interface PageData {
  // Server data
  pageTitle?: string;
  description?: string;
  pageLoadTime?: string;
  freshUserData?: UserMetadata[];
  lastFetched?: string;
  error?: { message: string; time: string };
  isAuthenticated?: boolean;
  wpUserData?: WPUserData;
  userData?: UserMetadata[];
  
  // Client-added data
  clientLoadTime: string;
  browser: string;
  clientFetch?: boolean;
  clientFetchError?: string;
}

/**
 * Client-side load function for the user metadata demo page
 * This demonstrates how to load data on the client using the userMetaStore
 */
export const load: PageLoad<PageData> = async ({ data, fetch, depends }) => {
  // Tell SvelteKit this data depends on the 'app:user-metadata' resource
  depends('app:user-metadata');
  
  console.log('🌐 Client-side page load running');
  console.log('📄 Server data:', data);
  
  // Get authentication info from cookies
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  const token = cookies['jwt_token'];
  const isAuthenticated = data.isAuthenticated;
  const userId = data.wpUserData?.metaResult?.user_id?.toString();
  
  console.log('🔐 Authentication state:', {
    isAuthenticated,
    hasToken: !!token,
    userId
  });
  
  // Enhanced result that includes the server data
  const result: PageData = {
    ...data,
    clientLoadTime: new Date().toISOString(),
    browser: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
  };
  
  // If we have authentication info, try to fetch fresh data on the client side
  if (isAuthenticated && token && userId) {
    console.log('🔄 Fetching fresh data on client side');
    
    try {
      // This won't block the page render but will update the store when it resolves
      userMetaStore.fetchUserMeta(userId, token, true)
        .then(freshData => {
          console.log('✅ Fresh client data loaded:', freshData);
        })
        .catch(err => {
          console.error('❌ Error loading client data:', err);
        });
      
      // Add a flag indicating we initiated a client-side fetch
      result.clientFetch = true;
    } catch (error) {
      console.error('❌ Error initiating client fetch:', error);
      result.clientFetchError = error instanceof Error ? error.message : 'Unknown error';
    }
  } else {
    console.log('⏭️ Skipping client fetch - not authenticated or missing info');
    result.clientFetch = false;
  }
  
  console.log('🏁 Client-side load complete');
  return result;
};
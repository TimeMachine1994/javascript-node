import type { PageServerLoad } from './$types';
import type { UserMetadata } from '$lib/types/user-metadata';
import type { ParsedCookieData } from '$lib/types/user-store';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
    console.log('[Load Start] - PageServerLoad initiated');
    let redirectUrl = '';

    // (For debugging only: log all cookie names)
    console.log('[Cookies] - Available cookie names:', Object.keys(cookies.getAll ? cookies.getAll() : {}));

    // Check for JWT token cookie
    const token = cookies.get('jwt_token');
    console.log('[JWT] - Token retrieved:', token);
    if (!token) {
        console.error('[JWT Error] - Authentication failed: no token found.');
        throw error(401, 'Authentication required');
    }

    // Retrieve user cookie data
    const userCookie = cookies.get('user');
    console.log('[User Cookie] - Retrieved user cookie:', userCookie);
    if (!userCookie) {
        console.error('[User Cookie Error] - Authentication failed: user data not found.');
        throw error(401, 'User data not found');
    }

    // Retrieve and parse user ID cookie data
    const idCookie = cookies.get('user_id');
    console.log('[User ID] - Raw user_id cookie:', idCookie);
    if (!idCookie) {
        console.error('[User ID Error] - No user_id cookie found');
        throw error(400, 'User ID cookie not found');
    }
    
    let userId: string | number;
    try {
        userId = JSON.parse(idCookie);
        console.log('[User ID] - Parsed userId:', userId);
    } catch (parseError) {
        console.error('[User ID Error] - Failed to parse userId from cookie:', idCookie, parseError);
        throw error(400, 'Invalid user ID cookie data');
    }
    if (!userId) {
        console.error('[User ID Error] - Parsed userId is empty or invalid.');
        throw error(400, 'User ID not found in cookie data');
    }

    try {
        console.log('[Metadata Fetch] - Initiating fetch for user metadata with userId:', userId);
        const response = await fetch(`/api/user-meta?user_id=${userId}`);
        console.log('[Metadata Fetch] - Received response:', response);
        if (!response.ok) {
            console.error('[Metadata Fetch Error] - Failed to fetch metadata. Status code:', response.status);
            throw error(response.status, 'Failed to fetch schedule data');
        }
        const metaData: UserMetadata = await response.json();
        console.log('[Metadata Fetch] - User metadata received:', metaData);
        
        // Parse meta array into object for easier access
        const metaObject: Record<string, string> = {};
        if (metaData?.meta && Array.isArray(metaData.meta)) {
            metaData.meta.forEach((item: { meta_key: string; meta_value: string }) => {
                metaObject[item.meta_key] = item.meta_value;
            });
        }
        
        // Parse calculator_data string to object if it exists
        let calculatorData = null;
        
        try {
            if (metaObject.calculator_data) {
                calculatorData = JSON.parse(metaObject.calculator_data as string);
                console.log('[Calculator Data] - Parsed calculator data:', calculatorData);
            }
        } catch (error) {
            console.error('[Parse Error] - Failed to parse calculator data:', error);
        }
        
        // Check calculator status from parsed data
        if (calculatorData?.meta?.status) {
            console.log('[Calculator Status] - Status found:', calculatorData.meta.status);
            switch (calculatorData.meta.status) {
                case 'draft':
                    console.log('[Redirect] - Status is draft, redirecting to /booking-calculator');
                    redirectUrl = '/booking-calculator';
                    break;
                case 'pending':
                    console.log('[Redirect] - Status is pending, redirecting to /booking-calculator');
                    redirectUrl = '/booking-calculator';
                    break;
                case 'error':
                    console.log('[Redirect] - Status is error, redirecting to /booking-calculator?error=true');
                    redirectUrl = '/booking-calculator?error=true';
                    break;
                case 'complete':
                    console.log('[Status] - Status is complete, continuing to family dashboard');
                    break;
                default:
                    console.warn('[Calculator Status Warning] - Unknown status encountered:', calculatorData.meta.status);
                    redirectUrl = '/booking-calculator';
                    break;
            }
        } else {
            console.log('[Calculator Status] - No meta.status found in calculator data, redirecting to /booking-calculator');
            redirectUrl = '/booking-calculator';
        }



        // Optionally, parse user meta from the user cookie if needed later
        let userMeta;
        try {
            if (typeof userCookie === 'string') {
                userMeta = JSON.parse(userCookie);
                console.log('[User Meta] - Parsed userMeta:', userMeta);
            }
        } catch (err) {
            console.error('[User Meta Error] - Failed to parse userMeta from cookie:', err);
        }
        
        console.log('[Load Complete] - Returning scheduleData and userMeta');
        return {
            scheduleData: metaData,
            userMeta
        };

    } catch (err) {
        console.error('[Load Error] - Error in schedule page load:', err);
        throw error(500, 'Failed to load schedule data');
    }
    
    // Only perform redirects from the main dashboard page
    // This prevents redirect loops and allows subpages to load properly
    const currentPath = '/family-dashboard';
    
    // Handle redirects outside of try/catch block
    if (redirectUrl && redirectUrl !== currentPath) {
        console.log('[Redirect] - Redirecting to:', redirectUrl);
        throw redirect(303, redirectUrl);
    }

};

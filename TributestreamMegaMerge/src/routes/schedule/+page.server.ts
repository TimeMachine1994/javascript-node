import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
    const token = cookies.get('jwt_token');
    if (!token) {
        throw error(401, 'Authentication required');
    }

    const userCookie = cookies.get('user');
    if (!userCookie) {
        throw error(401, 'User data not found');
    }

    const userData = JSON.parse(decodeURIComponent(userCookie));
    const userId = userData.metaResult?.user_id;

    if (!userId) {
        throw error(400, 'User ID not found in cookie data');
    }

    // Fetch user meta data
    const response = await fetch(`/api/user-meta?user_id=${userId}`);
    if (!response.ok) {
        throw error(response.status, 'Failed to fetch schedule data');
    }

    const metaData = await response.json();
    console.log('Meta data received:', metaData);
    
    // Return the data exactly as received from the API
    // The API returns { success: true, user_id: number, meta: MetaEntry[] }
    return {
        scheduleData: metaData
    };
};
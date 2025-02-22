import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { UserMetadata } from '$lib/types/user-metadata';

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

    try {
        // Fetch user meta data
        const response = await fetch(`/api/user-meta?user_id=${userId}`);
        if (!response.ok) {
            throw error(response.status, 'Failed to fetch schedule data');
        }

        const metaData = await response.json();
        console.log('Meta data received:', metaData);

        // Parse the memorial form data from the user cookie
        let userMeta: UserMetadata | null = null;
        try {
            if (userData.metaResult?.meta_value) {
                const memorialFormData = JSON.parse(userData.metaResult.meta_value);
                userMeta = {
                    memorial_form_data: memorialFormData,
                    calculator_data: userData.calculator_data || null,
                    user_id: userId.toString()
                };
            }
        } catch (e) {
            console.error('Error parsing memorial form data:', e);
        }
        
        return {
            scheduleData: metaData,
            userMeta
        };
    } catch (err) {
        console.error('Error in schedule page load:', err);
        throw error(500, 'Failed to load schedule data');
    }
};
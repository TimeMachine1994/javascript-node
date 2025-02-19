import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
    let memorialData;
    try {
        const userCookie = cookies.get('user');
        if (userCookie) {
            const userData = JSON.parse(decodeURIComponent(userCookie));
            if (userData.metaResult?.meta_value) {
                // Parse the nested JSON string in meta_value
                memorialData = JSON.parse(userData.metaResult.meta_value);
                console.log('Parsed memorial data:', memorialData); // Debug log
            }
        }
    } catch (error) {
        console.error('Error parsing memorial data:', error);
        console.error('Error details:', error instanceof Error ? error.message : error);
    }

    return {
        memorialData
    };
};

export const actions: Actions = {
    saveCalculator: async ({ request, cookies, fetch }) => {
        const token = cookies.get('jwt_token');
        if (!token) {
            throw error(401, 'Authentication required');
        }

        const userCookie = cookies.get('user');
        if (!userCookie) {
            throw error(401, 'User data not found');
        }

        const userData = JSON.parse(decodeURIComponent(userCookie));
        // The user ID is in the metaResult
        const userId = userData.metaResult?.user_id;
        
        if (!userId) {
            throw error(400, 'User ID not found in cookie data');
        }

        const data = await request.formData();
        const calculatorData = data.get('calculatorData');
        
        if (!calculatorData) {
            throw error(400, 'Calculator data is required');
        }

        // Make request to user-meta API
        const response = await fetch('/api/user-meta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                meta_key: 'calculator_data',
                meta_value: calculatorData
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw error(response.status, errorData.message || 'Failed to save calculator data');
        }

        return { success: true };
    }
};
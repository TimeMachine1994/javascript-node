import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import type { UserMetadata } from '$lib/types/user-metadata';

export const load: PageServerLoad = async ({ cookies }) => {
    let userData: UserMetadata[] = [];
    try {
        const userCookie = cookies.get('user');
        if (userCookie) {
            const cookieData = JSON.parse(decodeURIComponent(userCookie));
            if (cookieData.metaResult?.meta_value) {
                // Parse the memorial form data
                const memorialFormData = JSON.parse(cookieData.metaResult.meta_value);
                
                // Create UserMetadata object
                userData.push({
                    id: cookieData.metaResult.user_id,
                    memorial_form_data: memorialFormData,
                    calculator_data: cookieData.calculator_data || null
                });
                
                console.log('Parsed user data:', userData); // Debug log
            }
        }
    } catch (error) {
        console.error('Error parsing user data:', error);
        console.error('Error details:', error instanceof Error ? error.message : error);
    }

    return {
        userData
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

        // Update the user cookie with the new calculator data
        const updatedUserData = {
            ...userData,
            calculator_data: JSON.parse(calculatorData.toString())
        };
        cookies.set('user', JSON.stringify(updatedUserData), {
            path: '/',
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return { success: true };
    }
};
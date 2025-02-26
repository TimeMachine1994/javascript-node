import { redirect } from '@sveltejs/kit';
import type { ServerLoad, Actions } from '@sveltejs/kit';
import type { UserMeta, CalculatorData, FuneralHomeData } from '$lib/types/api';

export const load: ServerLoad = async ({ cookies, fetch }) => {
    const userId = cookies.get('user_id');
    const token = cookies.get('jwt_token');

    if (!userId || !token) {
        throw redirect(302, '/login');
    }

    try {
        const response = await fetch(`/api/user-meta?user_id=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user metadata');
        }

        const data = await response.json();
        
        // Find calculator-related meta data
        const calculatorData = data.find((meta: UserMeta) => meta.meta_key === 'calculator_data');
        const funeralHomeData = data.find((meta: UserMeta) => meta.meta_key === 'funeral_home_data');

        return {
            calculatorData: calculatorData ? JSON.parse(calculatorData.meta_value) as CalculatorData : null,
            funeralHomeData: funeralHomeData ? JSON.parse(funeralHomeData.meta_value) as FuneralHomeData : null,
            error: null
        };
    } catch (error) {
        console.error('Error loading user metadata:', error);
        return {
            calculatorData: null,
            funeralHomeData: null,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
};

export const actions: Actions = {
    save: async ({ cookies, request, fetch }) => {
        const userId = cookies.get('user_id');
        const token = cookies.get('jwt_token');

        if (!userId || !token) {
            throw redirect(302, '/login');
        }

        const data = await request.formData();
        const calculatorData = JSON.parse(data.get('calculatorData') as string);

        try {
            const response = await fetch('/api/user-meta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: userId,
                    meta_key: 'calculator_data',
                    meta_value: JSON.stringify(calculatorData)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save calculator data');
            }

            return { success: true };
        } catch (error) {
            console.error('Error saving calculator data:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            };
        }
    }
};
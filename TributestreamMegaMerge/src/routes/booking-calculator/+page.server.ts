import { error, redirect, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';
import type { Cookies } from '@sveltejs/kit';

interface MetaItem {
    meta_key: string;
    meta_value: string;
}

interface PaymentFormData {
    amount: string;
    package: string;
    date: string;
    time: string;
    location: string;
}

interface BookingFormData {
    package: string;
    date: string;
    time: string;
    location: string;
}

function validateFormData<T>(data: Record<string, FormDataEntryValue | null>, requiredFields: (keyof T)[]): data is Record<keyof T, string> {
    return requiredFields.every(field => {
        const value = data[field as string];
        return value !== null && value !== undefined && value !== '';
    });
}

export const load: PageServerLoad = async ({ fetch, cookies }: { fetch: typeof globalThis.fetch, cookies: Cookies }) => {
    console.log('🚀 [BOOKING-CALC] Load function started');
    
    // User identification logging
    console.log('🔍 [BOOKING-CALC] Checking cookies: ', {
        hasCookies: !!cookies,
        cookieCount: Object.keys(cookies.getAll()).length
    });
    
    const user_id = cookies.get('user_id');
    console.log('👤 [BOOKING-CALC] User ID from cookie:', user_id ? `Found (${user_id})` : 'Missing');
    
    if (!user_id) {
        console.error('❌ [BOOKING-CALC] Missing "user_id" query parameter.');
        throw error(400, 'user_id is required as a query parameter.');
    }

    const token = cookies.get('jwt_token');
    console.log('🔑 [BOOKING-CALC] JWT Token:', token ? 'Found' : 'Missing');
    
    if (!token) {
        console.error('❌ [BOOKING-CALC] Missing JWT token in cookies.');
        throw error(401, 'Authentication required');
    }
    
    // If both checks pass, continue, otherwise redirect
    if (!token || !user_id) {
        console.error('❌ [BOOKING-CALC] Authentication or user ID check failed.');
        redirect(303, '/');
    }
    try {
        const apiUrl = `https://wp.tributestream.com/wp-json/tributestream/v1/user-meta/${user_id}`;
        console.log('🔗 [BOOKING-CALC] Fetching data from:', apiUrl);
        console.log('📤 [BOOKING-CALC] Request headers:', {
            Authorization: token ? 'Bearer JWT_TOKEN_EXISTS' : 'Missing',
            'Content-Type': 'application/json'
        });

        console.time('🕒 [BOOKING-CALC] User Meta API Request');
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.timeEnd('🕒 [BOOKING-CALC] User Meta API Request');
        
        console.log('📥 [BOOKING-CALC] Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ [BOOKING-CALC] Error fetching user meta:', {
                status: response.status,
                statusText: response.statusText,
                errorData
            });
            throw error(response.status, errorData.message || 'Failed to fetch user meta.');
        }

        const jsonData = await response.json();
        console.log('📦 [BOOKING-CALC] Raw API response structure:', {
            hasMetaProperty: 'meta' in jsonData,
            responseKeys: Object.keys(jsonData),
            metaType: jsonData.meta ? (Array.isArray(jsonData.meta) ? 'array' : typeof jsonData.meta) : 'undefined'
        });
        
        const { meta } = jsonData;
        console.log('✅ [BOOKING-CALC] User meta data retrieved:',
            Array.isArray(meta) ? `${meta.length} items found` : 'No items or invalid format');

        // Create an object with keys as meta_key and values as meta_value
        console.log('🔄 [BOOKING-CALC] Processing meta items...');
        const metaObject = (meta as MetaItem[]).reduce((acc: Record<string, string>, { meta_key, meta_value }) => {
            acc[meta_key] = meta_value;
            return acc;
        }, {});
        console.log('📋 [BOOKING-CALC] Meta keys found:', Object.keys(metaObject));

        // Get Square configuration
        console.log('🛒 [BOOKING-CALC] Loading Square configuration');
        // Square configuration is optional
        const appId = env.SQUARE_APP_ID || null;
        const locationId = env.SQUARE_LOCATION_ID || null;
        console.log('🛒 [BOOKING-CALC] Square config loaded:', {
            appIdExists: !!appId,
            locationIdExists: !!locationId
        });

        console.log('✅ [BOOKING-CALC] Load function completed successfully');
        return {
            appId, locationId,
            userMeta: metaObject,
        };
    } catch (err: unknown) {
        console.error('💥 [BOOKING-CALC] Error in server load function:', err);
        if (err instanceof Error) {
            console.error('💥 [BOOKING-CALC] Error details:', {
                name: err.name,
                message: err.message,
                stack: err.stack
            });
        }
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
        throw error(500, errorMessage);
    }
};

export const actions = {
    savePayNow: async ({ request, cookies }) => {
        console.log('🚀 [BOOKING-CALC] savePayNow action started');
        
        try {
            // Process calculator data for local storage (browser-side state)
            const formData = await request.formData();
            const calculatorDataStr = formData.get('calculatorData');
            
            if (calculatorDataStr) {
                try {
                    // Parse data to set proper status for display on checkout page
                    const calculatorData = JSON.parse(calculatorDataStr.toString());
                    
                    // We could store this in a cookie if needed, but we'll skip the API call
                    // and just redirect the user to checkout
                    console.log('✅ [BOOKING-CALC] Data prepared for checkout page');
                } catch (parseError) {
                    console.error('❌ [BOOKING-CALC] JSON parse error:', parseError);
                }
            }
        } catch (err) {
            console.error('💥 [BOOKING-CALC] Error in savePayNow action:', err);
        }
        
        // Simply redirect to checkout page - no API call needed
        console.log('➡️ [BOOKING-CALC] Redirecting to checkout page');
        throw redirect(303, '/checkout');
    },

    savePayLater: async ({ request, cookies }) => {
        console.log('🚀 [BOOKING-CALC] savePayLater action started');
        
        try {
            // Process calculator data for local storage (browser-side state)
            const formData = await request.formData();
            const calculatorDataStr = formData.get('calculatorData');
            
            if (calculatorDataStr) {
                try {
                    // Parse data to set proper status for family dashboard
                    const calculatorData = JSON.parse(calculatorDataStr.toString());
                    
                    // We could store this in a cookie if needed, but we'll skip the API call
                    // and just redirect the user to the family dashboard
                    console.log('✅ [BOOKING-CALC] Data prepared for family dashboard');
                } catch (parseError) {
                    console.error('❌ [BOOKING-CALC] JSON parse error:', parseError);
                }
            }
        } catch (err) {
            console.error('💥 [BOOKING-CALC] Error in savePayLater action:', err);
        }
        
        // Simply redirect to family dashboard - no API call needed
        console.log('➡️ [BOOKING-CALC] Redirecting to family dashboard');
        throw redirect(303, '/family-dashboard');
    }
} satisfies Actions;

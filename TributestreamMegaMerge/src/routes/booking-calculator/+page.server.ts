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
        console.time('⏱️ [BOOKING-CALC] savePayNow execution time');
        
        // Authentication check
        const user_id = cookies.get('user_id');
        const token = cookies.get('jwt_token');
        console.log('🔑 [BOOKING-CALC] Auth check for savePayNow:', {
            userIdExists: !!user_id,
            tokenExists: !!token
        });

        if (!user_id || !token) {
            console.error('❌ [BOOKING-CALC] Authentication failed in savePayNow');
            return fail(401, {
                error: 'Authentication required'
            });
        }

        try {
            console.log('📦 [BOOKING-CALC] Processing form data in savePayNow...');
            const formData = await request.formData();
            const formDataKeys = Array.from(formData.keys());
            console.log('📋 [BOOKING-CALC] Form data keys:', formDataKeys);
            
            const calculatorDataStr = formData.get('calculatorData');
            console.log('🔍 [BOOKING-CALC] calculatorData exists:', !!calculatorDataStr);
            
            if (!calculatorDataStr) {
                console.error('❌ [BOOKING-CALC] Missing calculatorData in savePayNow form submission');
                console.timeEnd('⏱️ [BOOKING-CALC] savePayNow execution time');
                return fail(400, {
                    error: 'Missing calculator data'
                });
            }

            // Parse the JSON calculator data
            console.log('🔄 [BOOKING-CALC] Parsing calculator data in savePayNow...');
            let calculatorData;
            try {
                calculatorData = JSON.parse(calculatorDataStr.toString());
                console.log('✅ [BOOKING-CALC] Calculator data parsed successfully');
                console.log('📊 [BOOKING-CALC] Data structure:', {
                    hasTotal: 'total' in calculatorData,
                    hasSelectedPackage: 'selectedPackage' in calculatorData,
                    hasLivestreamDate: 'livestreamDate' in calculatorData,
                    hasLivestreamStartTime: 'livestreamStartTime' in calculatorData,
                    hasLocations: 'locations' in calculatorData && Array.isArray(calculatorData.locations),
                    hasMeta: 'meta' in calculatorData
                });
            } catch (parseError) {
                console.error('❌ [BOOKING-CALC] JSON parse error in savePayNow:', parseError);
                console.log('📄 [BOOKING-CALC] Raw calculator data string (first 100 chars):',
                    calculatorDataStr.toString().substring(0, 100) + '...');
                console.timeEnd('⏱️ [BOOKING-CALC] savePayNow execution time');
                return fail(400, {
                    error: 'Invalid calculator data format'
                });
            }
            
            // Add status to the meta object
            console.log('🔄 [BOOKING-CALC] Adding status to meta object in savePayNow');
            const dataWithStatus = {
                ...calculatorData,
                meta: {
                    ...calculatorData.meta,
                    status: 'pending' // Set status for checkout flow
                }
            };
            console.log('✅ [BOOKING-CALC] Status added:', dataWithStatus.meta?.status);

            // Extract fields for legacy meta fields
            console.log('🔄 [BOOKING-CALC] Extracting legacy payment data in savePayNow');
            const paymentData = {
                amount: calculatorData.total?.toString() || '0',
                package: calculatorData.selectedPackage || '',
                date: calculatorData.livestreamDate || '',
                time: calculatorData.livestreamStartTime || '',
                location: calculatorData.locations?.[0]?.name || ''
            };
            console.log('📊 [BOOKING-CALC] Payment data extracted:', paymentData);

            // Prepare API request
            const apiUrl = `https://wp.tributestream.com/wp-json/tributestream/v1/user-meta/${user_id}`;
            console.log('🔗 [BOOKING-CALC] Sending savePayNow data to:', apiUrl);
            
            const requestBody = {
                meta: [
                    // Store the full calculator data with status
                    {
                        meta_key: 'calculator_data',
                        meta_value: JSON.stringify(dataWithStatus)
                    },
                    // Keep legacy fields for backward compatibility
                    { meta_key: 'payment_status', meta_value: 'paid' },
                    { meta_key: 'payment_amount', meta_value: paymentData.amount },
                    { meta_key: 'selected_package', meta_value: paymentData.package },
                    { meta_key: 'booking_date', meta_value: paymentData.date },
                    { meta_key: 'booking_time', meta_value: paymentData.time },
                    { meta_key: 'booking_location', meta_value: paymentData.location }
                ]
            };
            console.log('📤 [BOOKING-CALC] Request payload structure:', {
                metaCount: requestBody.meta.length,
                hasCalculatorData: !!requestBody.meta.find(m => m.meta_key === 'calculator_data'),
                calculatorDataSize: JSON.stringify(dataWithStatus).length,
                paymentStatus: requestBody.meta.find(m => m.meta_key === 'payment_status')?.meta_value
            });

            // Update user metadata with payment information
            console.time('🕒 [BOOKING-CALC] savePayNow Meta API Request');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            console.timeEnd('🕒 [BOOKING-CALC] savePayNow Meta API Request');
            
            console.log('📥 [BOOKING-CALC] savePayNow API response:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ [BOOKING-CALC] savePayNow API error response:', errorData);
                console.timeEnd('⏱️ [BOOKING-CALC] savePayNow execution time');
                return fail(response.status, {
                    error: errorData.message || 'Failed to save payment information'
                });
            }

            console.log('✅ [BOOKING-CALC] Successfully saved payment data with status');
            console.timeEnd('⏱️ [BOOKING-CALC] savePayNow execution time');
           
        } catch (err) {
            console.error('💥 [BOOKING-CALC] Error in savePayNow action:', err);
            if (err instanceof Error) {
                console.error('💥 [BOOKING-CALC] Error details:', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
            }
            console.timeEnd('⏱️ [BOOKING-CALC] savePayNow execution time');
            return fail(500, {
                error: 'Internal server error while processing payment'
            });
        }
        
        console.log('➡️ [BOOKING-CALC] Redirecting to checkout page from savePayNow');
        throw redirect(303, '/checkout');
    },

    savePayLater: async ({ request, cookies }) => {
        console.log('🚀 [BOOKING-CALC] savePayLater action started');
        console.time('⏱️ [BOOKING-CALC] savePayLater execution time');
        
        // Authentication check
        const user_id = cookies.get('user_id');
        const token = cookies.get('jwt_token');
        console.log('🔑 [BOOKING-CALC] Auth check for savePayLater:', {
            userIdExists: !!user_id,
            tokenExists: !!token
        });

        if (!user_id || !token) {
            console.error('❌ [BOOKING-CALC] Authentication failed in savePayLater');
            return fail(401, {
                error: 'Authentication required'
            });
        }

        try {
            console.log('📦 [BOOKING-CALC] Processing form data in savePayLater...');
            const formData = await request.formData();
            const formDataKeys = Array.from(formData.keys());
            console.log('📋 [BOOKING-CALC] Form data keys in savePayLater:', formDataKeys);
            
            const calculatorDataStr = formData.get('calculatorData');
            console.log('🔍 [BOOKING-CALC] calculatorData exists in savePayLater:', !!calculatorDataStr);
            
            if (!calculatorDataStr) {
                console.error('❌ [BOOKING-CALC] Missing calculatorData in savePayLater form submission');
                console.timeEnd('⏱️ [BOOKING-CALC] savePayLater execution time');
                return fail(400, {
                    error: 'Missing calculator data'
                });
            }

            // Parse the JSON calculator data
            console.log('🔄 [BOOKING-CALC] Parsing calculator data in savePayLater...');
            let calculatorData;
            try {
                calculatorData = JSON.parse(calculatorDataStr.toString());
                console.log('✅ [BOOKING-CALC] Calculator data parsed successfully in savePayLater');
                console.log('📊 [BOOKING-CALC] savePayLater data structure:', {
                    hasSelectedPackage: 'selectedPackage' in calculatorData,
                    hasLivestreamDate: 'livestreamDate' in calculatorData,
                    hasLivestreamStartTime: 'livestreamStartTime' in calculatorData,
                    hasLocations: 'locations' in calculatorData && Array.isArray(calculatorData.locations),
                    hasMeta: 'meta' in calculatorData
                });
            } catch (parseError) {
                console.error('❌ [BOOKING-CALC] JSON parse error in savePayLater:', parseError);
                console.log('📄 [BOOKING-CALC] Raw calculator data string (first 100 chars):',
                    calculatorDataStr.toString().substring(0, 100) + '...');
                console.timeEnd('⏱️ [BOOKING-CALC] savePayLater execution time');
                return fail(400, {
                    error: 'Invalid calculator data format'
                });
            }
            
            // Add status to the meta object
            console.log('🔄 [BOOKING-CALC] Adding draft status to meta object in savePayLater');
            const dataWithStatus = {
                ...calculatorData,
                meta: {
                    ...calculatorData.meta,
                    status: 'draft' // Set status for draft flow
                }
            };
            console.log('✅ [BOOKING-CALC] Draft status added:', dataWithStatus.meta?.status);

            // Extract fields for legacy meta fields
            console.log('🔄 [BOOKING-CALC] Extracting legacy booking data in savePayLater');
            const bookingData = {
                package: calculatorData.selectedPackage || '',
                date: calculatorData.livestreamDate || '',
                time: calculatorData.livestreamStartTime || '',
                location: calculatorData.locations?.[0]?.name || ''
            };
            console.log('📊 [BOOKING-CALC] Booking data extracted:', bookingData);

            // Prepare API request
            const apiUrl = `https://wp.tributestream.com/wp-json/tributestream/v1/user-meta/${user_id}`;
            console.log('🔗 [BOOKING-CALC] Sending savePayLater data to:', apiUrl);
            
            const requestBody = {
                meta: [
                    // Store the full calculator data with status
                    {
                        meta_key: 'calculator_data',
                        meta_value: JSON.stringify(dataWithStatus)
                    },
                    // Keep legacy fields for backward compatibility
                    { meta_key: 'payment_status', meta_value: 'pending' },
                    { meta_key: 'selected_package', meta_value: bookingData.package },
                    { meta_key: 'booking_date', meta_value: bookingData.date },
                    { meta_key: 'booking_time', meta_value: bookingData.time },
                    { meta_key: 'booking_location', meta_value: bookingData.location }
                ]
            };
            console.log('📤 [BOOKING-CALC] savePayLater request payload structure:', {
                metaCount: requestBody.meta.length,
                hasCalculatorData: !!requestBody.meta.find(m => m.meta_key === 'calculator_data'),
                calculatorDataSize: JSON.stringify(dataWithStatus).length,
                paymentStatus: requestBody.meta.find(m => m.meta_key === 'payment_status')?.meta_value
            });

            // Update user metadata with booking information
            console.time('🕒 [BOOKING-CALC] savePayLater Meta API Request');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            console.timeEnd('🕒 [BOOKING-CALC] savePayLater Meta API Request');
            
            console.log('📥 [BOOKING-CALC] savePayLater API response:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ [BOOKING-CALC] savePayLater API error response:', errorData);
                console.timeEnd('⏱️ [BOOKING-CALC] savePayLater execution time');
                return fail(response.status, {
                    error: errorData.message || 'Failed to save booking information'
                });
            }

            console.log('✅ [BOOKING-CALC] Successfully saved booking data with draft status');
            console.timeEnd('⏱️ [BOOKING-CALC] savePayLater execution time');
            
        } catch (err) {
            console.error('💥 [BOOKING-CALC] Error in savePayLater action:', err);
            if (err instanceof Error) {
                console.error('💥 [BOOKING-CALC] Error details:', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
            }
            console.timeEnd('⏱️ [BOOKING-CALC] savePayLater execution time');
            return fail(500, {
                error: 'Internal server error while saving booking'
            });
        }
        
        console.log('➡️ [BOOKING-CALC] Redirecting to family dashboard from savePayLater');
        throw redirect(303, '/family-dashboard');
    }
} satisfies Actions;

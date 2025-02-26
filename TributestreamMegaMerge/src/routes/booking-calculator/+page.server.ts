import { error, redirect, fail } from '@sveltejs/kit';
import { VITE_SQUARE_APP_ID, VITE_SQUARE_LOCATION_ID } from '$env/static/private';
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

    console.log('🚀 Loading user meta data.');
     const user_id = cookies.get('user_id');
    if (!user_id) {
        console.error('❌ Missing "user_id" query parameter.');
         throw error(400, 'user_id is required as a query parameter.');
    }

    const token = cookies.get('jwt_token');
    if (!token) {
        console.error('❌ Missing JWT token in cookies.');
         throw error(401, 'Authentication required');
    }
    // If both checks pass, continue, otherwise redirect
    if (!token || !user_id) {
        console.error('❌ Authentication or user ID check failed.');
        redirect(303, '/');
    }
    try {
        const apiUrl = `https://wp.tributestream.com/wp-json/tributestream/v1/user-meta/${user_id}`;
        console.log('🔗 Fetching data from:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error fetching user meta:', errorData);
            throw error(response.status, errorData.message || 'Failed to fetch user meta.');
        }

        const { meta } = await response.json();
        console.log('✅ User meta data retrieved:', meta);

        // Create an object with keys as meta_key and values as meta_value
        const metaObject = (meta as MetaItem[]).reduce((acc: Record<string, string>, { meta_key, meta_value }) => {
            acc[meta_key] = meta_value;
            return acc;
        }, {});

        const appId = VITE_SQUARE_APP_ID;
        const locationId = VITE_SQUARE_LOCATION_ID;

        
        return {
            appId, locationId,
            userMeta: metaObject,
        };
    } catch (err: unknown) {
        console.error('💥 Error in server load function:', err);
        const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
        throw error(500, errorMessage);
    }
};

export const actions = {
    savePayNow: async ({ request, cookies }) => {
        const user_id = cookies.get('user_id');
        const token = cookies.get('jwt_token');

        if (!user_id || !token) {
            return fail(401, {
                error: 'Authentication required'
            });
        }

        try {
            const formData = await request.formData();
            const rawPaymentData = {
                amount: formData.get('amount'),
                package: formData.get('package'),
                date: formData.get('date'),
                time: formData.get('time'),
                location: formData.get('location')
            };

            const requiredFields: (keyof PaymentFormData)[] = ['amount', 'package', 'date', 'time', 'location'];
            
            if (!validateFormData<PaymentFormData>(rawPaymentData, requiredFields)) {
                return fail(400, {
                    error: `Missing or invalid required fields: ${requiredFields.join(', ')}`
                });
            }

            const paymentData = rawPaymentData as PaymentFormData;

            // Update user metadata with payment information
            const response = await fetch(`https://wp.tributestream.com/wp-json/tributestream/v1/user-meta/${user_id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    meta: [
                        { meta_key: 'payment_status', meta_value: 'paid' },
                        { meta_key: 'payment_amount', meta_value: paymentData.amount },
                        { meta_key: 'selected_package', meta_value: paymentData.package },
                        { meta_key: 'booking_date', meta_value: paymentData.date },
                        { meta_key: 'booking_time', meta_value: paymentData.time },
                        { meta_key: 'booking_location', meta_value: paymentData.location }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return fail(response.status, {
                    error: errorData.message || 'Failed to save payment information'
                });
            }

           
        } catch (err) {
            console.error('Error in savePayNow action:', err);
            return fail(500, {
                error: 'Internal server error while processing payment'
            });
            
        }
        throw redirect(303, '/checkout');

    },

    savePayLater: async ({ request, cookies }) => {
        const user_id = cookies.get('user_id');
        const token = cookies.get('jwt_token');

        if (!user_id || !token) {
            return fail(401, {
                error: 'Authentication required'
            });
        }

        try {
            const formData = await request.formData();
            const rawBookingData = {
                package: formData.get('package'),
                date: formData.get('date'),
                time: formData.get('time'),
                location: formData.get('location')
            };

            const requiredFields: (keyof BookingFormData)[] = ['package', 'date', 'time', 'location'];
            
            if (!validateFormData<BookingFormData>(rawBookingData, requiredFields)) {
                return fail(400, {
                    error: `Missing or invalid required fields: ${requiredFields.join(', ')}`
                });
            }

            const bookingData = rawBookingData as BookingFormData;

            // Update user metadata with booking information
            const response = await fetch(`https://wp.tributestream.com/wp-json/tributestream/v1/user-meta/${user_id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    meta: [
                        { meta_key: 'payment_status', meta_value: 'pending' },
                        { meta_key: 'selected_package', meta_value: bookingData.package },
                        { meta_key: 'booking_date', meta_value: bookingData.date },
                        { meta_key: 'booking_time', meta_value: bookingData.time },
                        { meta_key: 'booking_location', meta_value: bookingData.location }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return fail(response.status, {
                    error: errorData.message || 'Failed to save booking information'
                });
            }

         } catch (err) {
            console.error('Error in savePayLater action:', err);
            return fail(500, {
                error: 'Internal server error while saving booking'
            });
        }
        throw redirect(303, '/family-dashboard');

    }
} satisfies Actions;

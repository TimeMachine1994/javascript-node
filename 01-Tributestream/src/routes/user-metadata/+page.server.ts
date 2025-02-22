import type { PageServerLoad } from './$types';
import type { MetaEntry, UserMetadata } from '$lib/types/user-metadata';

/**
 * Server-side load function to fetch user metadata
 */
export const load: PageServerLoad = async ({ cookies, fetch }) => {
    const token = cookies.get('jwt_token');
    const userId = cookies.get('user_id');

    if (!token || !userId) {
        throw new Error('Authentication required');
    }

    try {
        // Fetch user metadata from WordPress API
        const response = await fetch(`/wp-json/wp/v2/users/${userId}/meta`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user metadata');
        }

        const metaData: MetaEntry[] = await response.json();

        // Transform metadata into structured format
        const transformedData = metaData.reduce((acc, item) => {
            try {
                // Parse the meta_value as JSON, falling back to string if parsing fails
                let parsedValue;
                try {
                    parsedValue = JSON.parse(item.meta_value);
                } catch (e) {
                    parsedValue = item.meta_value;
                }

                // Handle nested objects for memorial_form_data and calculator_data
                if (item.meta_key === 'memorial_form_data' || item.meta_key === 'calculator_data') {
                    acc[item.meta_key] = parsedValue;
                } else {
                    // For other metadata, store as is
                    acc[item.meta_key] = parsedValue;
                }
            } catch (e) {
                console.error(`Failed to parse metadata for key: ${item.meta_key}`, e);
                acc[item.meta_key] = item.meta_value;
            }
            return acc;
        }, {} as UserMetadata);

        // Ensure required data structures exist
        if (!transformedData.memorial_form_data) {
            transformedData.memorial_form_data = {
                director: { firstName: '', lastName: '' },
                familyMember: { name: '', dob: '' },
                deceased: { name: '', dob: '', dateOfPassing: '' },
                contact: { email: '', phone: '' },
                memorial: { location: '', date: '', time: '' }
            };
        }

        if (!transformedData.calculator_data) {
            transformedData.calculator_data = {
                scheduleDays: [],
                cartItems: [],
                cartTotal: 0,
                selectedPackage: '',
                personalDetails: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: ''
                }
            };
        }

        return {
            userData: transformedData,
            userId
        };
    } catch (error) {
        console.error('Error loading user metadata:', error);
        throw error;
    }
};
import type { PageServerLoad } from './$types';
import type { MetaEntry } from '$lib/types/user-metadata';

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
        // Fetch all user metadata
        const response = await fetch('/api/user-meta', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user metadata');
        }

        const metaData: MetaEntry[] = await response.json();

        // Transform metadata into structured format
        const transformedData = metaData.reduce((acc, item) => {
            try {
                acc[item.meta_key] = JSON.parse(item.meta_value);
            } catch (e) {
                console.error(`Failed to parse metadata for key: ${item.meta_key}`);
                acc[item.meta_key] = item.meta_value;
            }
            return acc;
        }, {} as Record<string, any>);

        return {
            userData: transformedData,
            userId
        };
    } catch (error) {
        console.error('Error loading user metadata:', error);
        throw error;
    }
};
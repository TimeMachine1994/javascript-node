import type { PageServerLoad } from './$types';
import type { Tribute } from '$lib/types/api';

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        // Fetch all tributes (using a larger per_page value)
        const response = await fetch('/api/tributes?per_page=100');
        const data = await response.json();

        if (!data.success) {
            console.error('Failed to fetch tributes:', data.message);
            return {
                tributes: [],
                error: data.message
            };
        }

        return {
            tributes: data.items || [],
            total: data.total || 0
        };
    } catch (error) {
        console.error('Error loading tributes:', error);
        return {
            tributes: [],
            error: 'Failed to load tributes'
        };
    }
};
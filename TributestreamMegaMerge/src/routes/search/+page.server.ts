import type { PageServerLoad } from './$types';
import type { SearchPageData } from './types';

export const load = (async ({ fetch, url }) => {
    const page = url.searchParams.get('page') || '1';
    const per_page = url.searchParams.get('per_page') || '10';
    const search = url.searchParams.get('search') || '';

    try {
        const response = await fetch(`/api/tributes?page=${page}&per_page=${per_page}&search=${search}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch tributes');
        }

        return {
            tributes: data.tributes || [],
            totalPages: data.total_pages || 0,
            totalItems: data.total_items || 0,
            currentPage: parseInt(page),
            searchQuery: search
        } satisfies SearchPageData;
    } catch (error) {
        console.error('Error loading tributes:', error);
        return {
            tributes: [],
            totalPages: 0,
            totalItems: 0,
            currentPage: 1,
            searchQuery: search,
            error: error instanceof Error ? error.message : 'Failed to load tributes'
        } satisfies SearchPageData;
    }
}) satisfies PageServerLoad;
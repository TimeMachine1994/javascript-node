import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { User, Tribute } from '$lib/types/api';

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
    const user = locals.user as User | undefined;
    if (!user) {
        throw error(401, 'Unauthorized');
    }

    // Get pagination parameters
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = 10;

    try {
        // Fetch user's orders
        const response = await fetch(
            `${import.meta.env.VITE_WP_API_URL}/wp/v2/tributes?author=${user.id}&page=${page}&per_page=${limit}&orderby=date&order=desc`,
            {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const orders = await response.json() as Tribute[];
        const totalOrders = Number(response.headers.get('X-WP-Total')) || 0;
        const totalPages = Number(response.headers.get('X-WP-TotalPages')) || 1;

        return {
            orders,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalOrders,
                itemsPerPage: limit
            },
            user
        };
    } catch (e) {
        console.error('Error fetching orders:', e);
        throw error(500, 'Failed to load orders');
    }
};
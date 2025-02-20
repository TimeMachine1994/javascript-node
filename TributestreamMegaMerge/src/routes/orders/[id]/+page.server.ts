import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { User, Tribute } from '$lib/types/api';

export const load: PageServerLoad = async ({ params, locals, fetch }) => {
    const user = locals.user as User | undefined;
    if (!user) {
        throw error(401, 'Unauthorized');
    }

    try {
        // Fetch order details
        const response = await fetch(
            `${import.meta.env.VITE_WP_API_URL}/wp/v2/tributes/${params.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            }
        );

        if (!response.ok) {
            throw error(404, 'Order not found');
        }

        const order = await response.json() as Tribute;

        // Verify user has access to this order
        if (order.author !== user.id) {
            throw error(403, 'Access denied');
        }

        return {
            order,
            user
        };
    } catch (e) {
        console.error('Error fetching order:', e);
        throw error(500, 'Failed to load order details');
    }
};
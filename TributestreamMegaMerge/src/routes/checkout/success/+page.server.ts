import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { User } from '$lib/types/api';

export const load: PageServerLoad = async ({ locals, url }) => {
    // Ensure user is authenticated
    const user = locals.user as User | undefined;
    if (!user) {
        throw redirect(302, `/login?redirect=${url.pathname}`);
    }

    // Get order ID from URL params
    const orderId = url.searchParams.get('order');
    if (!orderId) {
        throw redirect(302, '/');
    }

    try {
        // Fetch order details from WordPress
        const response = await fetch(
            `${import.meta.env.VITE_WP_API_URL}/wp/v2/tributes/${orderId}`,
            {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }

        const orderData = await response.json();

        return {
            order: orderData,
            user
        };
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw redirect(302, '/');
    }
};
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    // Ensure user is authenticated
    if (!locals.user) {
        throw redirect(302, `/login?redirect=${url.pathname}`);
    }

    // Note: The calculator data will be passed through page state
    // We don't need to load anything server-side for the initial render
    return {
        user: locals.user
    };
};
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    // If user is already logged in, redirect them to their dashboard or profile
    if (locals.user) {
        throw redirect(302, '/dashboard');
    }

    return {
        // Add any server-side data needed for the page
    };
};

// Types for our form data
export interface TributeFormData {
    lovedOneName: string;
    userName: string;
    userEmail: string;
    userPhone: string;
}

// Types for API responses
export interface RegisterResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
    };
}

export interface TributeResponse {
    id: number;
    loved_one_name: string;
    user_id: number;
    phone_number: string;
    created_at: string;
}
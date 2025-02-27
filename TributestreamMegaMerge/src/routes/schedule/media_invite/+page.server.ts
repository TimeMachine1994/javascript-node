import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Cookies } from '@sveltejs/kit';
import type { WPUserData } from '$lib/types/user-metadata';

export const load: PageServerLoad = async ({ cookies }: { cookies: Cookies }) => {
    console.log('🚀 [MEDIA-INVITE] Load function started');
    
    // User identification logging
    console.log('🔍 [MEDIA-INVITE] Checking cookies');
    
    const user_id = cookies.get('user_id');
    const token = cookies.get('jwt_token');
    
    console.log('👤 [MEDIA-INVITE] Auth check:', {
        userIdExists: !!user_id,
        tokenExists: !!token
    });

    if (!user_id || !token) {
        console.error('❌ [MEDIA-INVITE] Missing authentication');
        throw redirect(303, '/login');
    }

    try {
        // Validate token with WordPress
        const validationResponse = await fetch('https://wp.tributestream.com/wp-json/jwt-auth/v1/token/validate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!validationResponse.ok) {
            console.error('❌ [MEDIA-INVITE] Token validation failed');
            // Clear invalid token
            cookies.delete('jwt_token', { path: '/' });
            throw redirect(303, '/login');
        }

        // Fetch user data
        const userResponse = await fetch(`https://wp.tributestream.com/wp-json/wp/v2/users/${user_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw error(userResponse.status, 'Failed to fetch user data');
        }

        const userData: WPUserData = await userResponse.json();
        console.log('✅ [MEDIA-INVITE] User data fetched successfully');

        // Fetch user's memorial metadata
        const metaResponse = await fetch(`https://wp.tributestream.com/wp-json/tributestream/v1/user-meta/${user_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!metaResponse.ok) {
            throw error(metaResponse.status, 'Failed to fetch user metadata');
        }

        const metaData = await metaResponse.json();
        console.log('✅ [MEDIA-INVITE] User metadata fetched successfully');

        // Merge metadata into user data
        userData.metaResult = metaData;

        return {
            user_id,
            token,
            userData
        };
    } catch (err) {
        console.error('💥 [MEDIA-INVITE] Error in load function:', err);
        if (err instanceof Error) {
            console.error('💥 [MEDIA-INVITE] Error details:', {
                name: err.name,
                message: err.message,
                stack: err.stack
            });
        }
        throw error(500, 'Internal server error while loading media invite page');
    }
};
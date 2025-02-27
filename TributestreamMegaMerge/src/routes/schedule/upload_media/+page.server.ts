import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Cookies } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }: { cookies: Cookies }) => {
    console.log('🚀 [UPLOAD-MEDIA] Load function started');
    
    // User identification logging
    console.log('🔍 [UPLOAD-MEDIA] Checking cookies');
    
    const user_id = cookies.get('user_id');
    const token = cookies.get('jwt_token');
    
    console.log('👤 [UPLOAD-MEDIA] Auth check:', {
        userIdExists: !!user_id,
        tokenExists: !!token
    });

    if (!user_id || !token) {
        console.error('❌ [UPLOAD-MEDIA] Missing authentication');
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
            console.error('❌ [UPLOAD-MEDIA] Token validation failed');
            // Clear invalid token
            cookies.delete('jwt_token', { path: '/' });
            throw redirect(303, '/login');
        }

        console.log('✅ [UPLOAD-MEDIA] Token validated successfully');

        return {
            user_id,
            token,
        };
    } catch (err) {
        console.error('💥 [UPLOAD-MEDIA] Error in load function:', err);
        if (err instanceof Error) {
            console.error('💥 [UPLOAD-MEDIA] Error details:', {
                name: err.name,
                message: err.message,
                stack: err.stack
            });
        }
        throw error(500, 'Internal server error while validating authentication');
    }
};
/**
 * SvelteKit POST endpoint for handling user logout.
 * This endpoint will:
 *   1. Clear the JWT token cookie
 *   2. Clear the user data cookie
 *   3. Clear the event.locals state
 *   4. Return a success response
 *
 * Note: This endpoint is structured to accommodate future WordPress integration
 * when needed.
 */

import { type RequestEvent } from '@sveltejs/kit';

export async function POST({ cookies, locals }: RequestEvent) {
    console.log('🚀 [Logout API] POST request received');

    try {
        // Clear the JWT token cookie - match exact settings from login
        cookies.delete('jwt_token', {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
    
        console.log('🍪 [Logout API] Cleared JWT token cookie');

        // Clear the user ID cookie - match exact settings from login
        cookies.delete('user_id', {
            path: '/',
            secure: true,
            sameSite: 'strict'
            // Note: No httpOnly flag here as it wasn't set with httpOnly in login
        });
        console.log('🍪 [Logout API] Cleared user ID cookie');

                    // Step 7: Set user data with roles and meta data (client-accessible)
                    cookies.delete('user', {
                      
                        path: '/',
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 24 // 24 hours
                    });
        // Clear locals state using undefined
        locals.jwt_token = undefined;
        locals.user_id = undefined;
        console.log('🔄 [Logout API] Cleared locals state');

        // Future WordPress integration can be added here
        // Example: Invalidate WordPress session if needed
        // await invalidateWordPressSession(token);

        console.log('✅ [Logout API] Logout successful');
        
        return new Response(
            JSON.stringify({ 
                message: 'Logged out successfully',
                status: 'success'
            }), 
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('❌ [Logout API] Error during logout:', error);
        
        return new Response(
            JSON.stringify({
                message: 'Error during logout process',
                status: 'error'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
/**
 * SvelteKit POST endpoint for logging out users.
 * This endpoint will:
 *   1. Invalidate the JWT token on WordPress backend
 *   2. Clear local authentication data
 *   3. Return success/error response
 */

import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { clearAuthData, getAuthHeaders } from '$lib/utils/auth';

export async function POST({ request }: RequestEvent) {
    console.log('🚀 [Logout API] POST request received.');

    try {
        // Get auth headers from the request
        const headers = getAuthHeaders();
        
        // Only proceed with WordPress token invalidation if we have a token
        if ('Authorization' in headers) {
            try {
                console.log('🔄 [Logout API] Invalidating token on WordPress...');
                const response = await fetch('https://wp.tributestream.com/wp-json/tributestream/v1/logout', {
                    method: 'POST',
                    headers: headers as Record<string, string>
                });

                if (!response.ok) {
                    console.warn('⚠️ [Logout API] WordPress token invalidation failed:', response.statusText);
                    // We'll continue with local logout even if WordPress logout fails
                }
            } catch (error) {
                console.error('🚨 [Logout API] Error during WordPress logout:', error);
                // Continue with local logout despite WordPress error
            }
        }

        // Clear local authentication data
        console.log('🗑️ [Logout API] Clearing local authentication data...');
        clearAuthData();

        // Return success response
        console.log('✅ [Logout API] Logout successful.');
        return json(
            {
                success: true,
                message: 'Successfully logged out'
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('🚨 [Logout API] Unexpected error during logout:', error);
        
        // Still clear local auth data even if there was an error
        clearAuthData();
        
        return json(
            {
                error: true,
                message: 'An error occurred during logout, but local session was cleared'
            },
            { status: 500 }
        );
    }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Allow': 'POST, OPTIONS'
        }
    });
}
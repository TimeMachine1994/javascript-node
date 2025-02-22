/**
 * SvelteKit endpoint for managing user metadata in WordPress.
 * This endpoint will:
 *   1. Handle GET requests to fetch user metadata
 *   2. Handle POST requests to update user metadata
 *   3. Use JWT authentication for WordPress API requests
 */

import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getAuthHeaders } from '$lib/utils/auth';
import type { MetaEntry } from '$lib/types/user-metadata';

// Request/Response interfaces
interface MetaRequest {
    user_id: number;
    meta_key: string;
    meta_value: string;
}

interface MetaResponse {
    success: boolean;
    message: string;
    meta_entries?: MetaEntry[];
    meta_entry?: MetaEntry;
}

// Error handling utility
function handleApiError(response: Response, defaultMessage: string) {
    return async () => {
        try {
            const errorData = await response.json();
            throw error(
                response.status,
                errorData.message || defaultMessage
            );
        } catch {
            throw error(response.status, defaultMessage);
        }
    };
}

export async function GET({ url }: RequestEvent) {
    console.log('🚀 [User Meta API] GET request received.');

    try {
        // Get user_id from query parameters
        const user_id = url.searchParams.get('user_id');
        console.log('🔍 [User Meta API] Checking query parameter "user_id":', user_id);

        if (!user_id) {
            console.error('❌ [User Meta API] Missing "user_id" query parameter.');
            throw error(400, 'user_id is required as a query parameter.');
        }

        // Get auth headers using our utility
        const headers = getAuthHeaders();
        if (!('Authorization' in headers)) {
            console.error('❌ [User Meta API] No authorization token found.');
            throw error(401, 'Authentication required');
        }

        // Construct API URL
        const apiUrl = `https://wp.tributestream.com/wp-json/tributestream/v1/user-meta/${user_id}`;
        console.log('🔗 [User Meta API] Sending request to WordPress API:', apiUrl);

        // Make request to WordPress
        const wpResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: headers as Record<string, string>
        });

        console.log('📡 [User Meta API] WordPress API response status:', wpResponse.status);

        // Handle non-OK responses
        if (!wpResponse.ok) {
            await handleApiError(wpResponse, 'Failed to fetch meta entries.')();
        }

        // Parse and return the response
        const responseData: MetaResponse = await wpResponse.json();
        console.log('✅ [User Meta API] Meta data successfully retrieved:', responseData);

        return json(responseData);
    } catch (err) {
        console.error('💥 [User Meta API] Error in GET handler:', {
            message: err instanceof Error ? err.message : 'Unknown error',
            stack: err instanceof Error ? err.stack : undefined,
            status: (err as { status?: number }).status || 500
        });
        throw error(
            (err as { status?: number }).status || 500,
            err instanceof Error ? err.message : 'Internal Server Error'
        );
    }
}

export async function POST({ request }: RequestEvent) {
    console.log('🚀 [User Meta API] POST request received.');

    try {
        // Get auth headers using our utility
        const headers = getAuthHeaders();
        if (!('Authorization' in headers)) {
            console.error('❌ [User Meta API] No authorization token found.');
            throw error(401, 'Authentication required');
        }

        // Parse request body
        const body = await request.json() as MetaRequest;
        const { user_id, meta_key, meta_value } = body;
        console.log('📦 [User Meta API] Request body received:', body);

        // Validate required fields
        if (!user_id || !meta_key || !meta_value) {
            console.error('❌ [User Meta API] Missing required fields in request body.', {
                user_id,
                meta_key,
                meta_value,
            });
            throw error(400, 'user_id, meta_key, and meta_value are required.');
        }

        // Construct API URL
        const apiUrl = 'https://wp.tributestream.com/wp-json/tributestream/v1/user-meta';
        console.log('🔗 [User Meta API] WordPress API URL constructed:', apiUrl);

        // Send request to WordPress
        console.log('🚀 [User Meta API] Sending POST request to WordPress API...');
        const wpResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: headers as Record<string, string>,
            body: JSON.stringify(body)
        });

        console.log('📡 [User Meta API] WordPress API response status:', wpResponse.status);

        // Handle non-OK responses
        if (!wpResponse.ok) {
            await handleApiError(wpResponse, 'Failed to write meta entry.')();
        }

        // Parse and return the response
        const responseData: MetaResponse = await wpResponse.json();
        console.log('✅ [User Meta API] Meta data successfully written:', responseData);

        return json(responseData);
    } catch (err) {
        console.error('💥 [User Meta API] Error in POST handler:', {
            message: err instanceof Error ? err.message : 'Unknown error',
            stack: err instanceof Error ? err.stack : undefined,
            status: (err as { status?: number }).status || 500
        });
        throw error(
            (err as { status?: number }).status || 500,
            err instanceof Error ? err.message : 'Internal Server Error'
        );
    }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Allow': 'GET, POST, OPTIONS'
        }
    });
}
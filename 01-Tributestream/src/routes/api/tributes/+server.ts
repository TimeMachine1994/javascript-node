/**
 * SvelteKit endpoint for managing tributes through WordPress API.
 * This endpoint will:
 *   1. Handle GET requests to fetch tributes with pagination and search
 *   2. Handle POST requests to create new tributes
 *   3. Use JWT authentication for protected operations
 */

import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { Tribute, PaginatedResponse } from '$lib/types/api';
import { getAuthHeaders } from '$lib/utils/auth';

// Custom error type for API errors
interface ApiError {
    status: number;
    message: string;
    stack?: string;
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

// Error handling utility for catch blocks
function handleError(err: unknown, defaultStatus = 500): ApiError {
    const status = (err instanceof Error && 'status' in err) ? 
        (err as { status?: number }).status || defaultStatus : 
        defaultStatus;

    return {
        status,
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        stack: err instanceof Error ? err.stack : undefined
    };
}

export async function GET({ url }: RequestEvent) {
    console.log('🚀 [Tributes API] GET request received.');

    try {
        // Get pagination and search parameters
        const page = url.searchParams.get('page') || '1';
        const per_page = url.searchParams.get('per_page') || '10';
        const search = url.searchParams.get('search') || '';
        
        console.log('📝 [Tributes API] Query parameters:', { page, per_page, search });

        // Construct API URL with query parameters
        const apiUrl = new URL('https://wp.tributestream.com/wp-json/tributestream/v1/tributes');
        apiUrl.searchParams.set('page', page);
        apiUrl.searchParams.set('per_page', per_page);
        if (search) apiUrl.searchParams.set('search', search);

        console.log('🔗 [Tributes API] Sending request to:', apiUrl.toString());

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 [Tributes API] Response status:', response.status);

            if (!response.ok) {
                await handleApiError(response, 'Failed to fetch tributes')();
            }

            const data = await response.json() as PaginatedResponse<Tribute>;
            console.log('✅ [Tributes API] Successfully fetched tributes:', {
                total: data.total,
                current_page: data.current_page,
                total_pages: data.total_pages
            });

            return json({ success: true, ...data });
        } catch (err) {
            console.error('❌ [Tributes API] WordPress fetch error:', err);
            const { status, message } = handleError(err, 400);
            throw error(status, message);
        }
    } catch (err) {
        console.error('💥 [Tributes API] GET endpoint error:', err);
        const { status, message } = handleError(err);
        throw error(status, message);
    }
}

export async function POST({ request }: RequestEvent) {
    console.log('🚀 [Tributes API] POST request received.');

    try {
        // Get auth headers using our utility
        const headers = getAuthHeaders();
        if (!('Authorization' in headers)) {
            console.error('❌ [Tributes API] No authorization token found.');
            throw error(401, 'Authentication required');
        }

        try {
            // Parse request body
            const data = await request.json();
            console.log('📝 [Tributes API] Request body:', data);

            // Send request to WordPress
            const response = await fetch(
                'https://wp.tributestream.com/wp-json/tributestream/v1/tributes',
                {
                    method: 'POST',
                    headers: {
                        ...headers as Record<string, string>,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            );

            console.log('📡 [Tributes API] Response status:', response.status);

            if (!response.ok) {
                await handleApiError(response, 'Failed to create tribute')();
            }

            const result = await response.json();
            console.log('✅ [Tributes API] Tribute created successfully:', { id: result.id });

            return json({ success: true, id: result.id }, { status: 201 });
        } catch (err) {
            console.error('❌ [Tributes API] WordPress creation error:', err);
            const { status, message } = handleError(err, 400);
            throw error(status, message);
        }
    } catch (err) {
        console.error('💥 [Tributes API] POST endpoint error:', err);
        const { status, message } = handleError(err);
        throw error(status, message);
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
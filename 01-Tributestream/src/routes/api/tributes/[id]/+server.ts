/**
 * SvelteKit endpoint for managing individual tributes through WordPress API.
 * This endpoint will:
 *   1. Handle GET requests to fetch a specific tribute
 *   2. Handle PUT requests to update a tribute
 *   3. Handle DELETE requests to remove a tribute
 *   4. Use JWT authentication for protected operations
 */

import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { Tribute } from '$lib/types/api';
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

export async function GET({ params }: RequestEvent) {
    console.log('🚀 [Tribute API] GET request received for tribute:', params.id);

    try {
        const response = await fetch(
            `https://wp.tributestream.com/wp-json/tributestream/v1/tributes/${params.id}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('📡 [Tribute API] Response status:', response.status);

        if (!response.ok) {
            await handleApiError(response, `Failed to fetch tribute ${params.id}`)();
        }

        const data = await response.json() as Tribute;
        console.log('✅ [Tribute API] Successfully fetched tribute:', params.id);

        return json(data);
    } catch (err) {
        console.error('💥 [Tribute API] GET endpoint error:', err);
        const { status, message } = handleError(err);
        throw error(status, message);
    }
}

export async function PUT({ params, request }: RequestEvent) {
    console.log('🚀 [Tribute API] PUT request received for tribute:', params.id);

    try {
        // Get auth headers using our utility
        const headers = getAuthHeaders();
        if (!('Authorization' in headers)) {
            console.error('❌ [Tribute API] No authorization token found.');
            throw error(401, 'Authentication required');
        }

        try {
            const data = await request.json();
            console.log('📝 [Tribute API] Update data:', data);

            const response = await fetch(
                `https://wp.tributestream.com/wp-json/tributestream/v1/tributes/${params.id}`,
                {
                    method: 'PUT',
                    headers: {
                        ...headers as Record<string, string>,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            );

            console.log('📡 [Tribute API] Response status:', response.status);

            if (!response.ok) {
                await handleApiError(response, `Failed to update tribute ${params.id}`)();
            }

            const result = await response.json();
            console.log('✅ [Tribute API] Successfully updated tribute:', params.id);

            return json(result);
        } catch (err) {
            console.error('❌ [Tribute API] Update error:', err);
            const { status, message } = handleError(err, 400);
            throw error(status, message);
        }
    } catch (err) {
        console.error('💥 [Tribute API] PUT endpoint error:', err);
        const { status, message } = handleError(err);
        throw error(status, message);
    }
}

export async function DELETE({ params }: RequestEvent) {
    console.log('🚀 [Tribute API] DELETE request received for tribute:', params.id);

    try {
        // Get auth headers using our utility
        const headers = getAuthHeaders();
        if (!('Authorization' in headers)) {
            console.error('❌ [Tribute API] No authorization token found.');
            throw error(401, 'Authentication required');
        }

        try {
            const response = await fetch(
                `https://wp.tributestream.com/wp-json/tributestream/v1/tributes/${params.id}`,
                {
                    method: 'DELETE',
                    headers: headers as Record<string, string>
                }
            );

            console.log('📡 [Tribute API] Response status:', response.status);

            if (!response.ok) {
                await handleApiError(response, `Failed to delete tribute ${params.id}`)();
            }

            const result = await response.json();
            console.log('✅ [Tribute API] Successfully deleted tribute:', params.id);

            return json(result);
        } catch (err) {
            console.error('❌ [Tribute API] Deletion error:', err);
            const { status, message } = handleError(err, 400);
            throw error(status, message);
        }
    } catch (err) {
        console.error('💥 [Tribute API] DELETE endpoint error:', err);
        const { status, message } = handleError(err);
        throw error(status, message);
    }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Allow': 'GET, PUT, DELETE, OPTIONS'
        }
    });
}
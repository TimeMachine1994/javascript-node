import { error, json } from '@sveltejs/kit';

/**
 * @typedef {Object} WordPressError
 * @property {string} [message] - Error message
 * @property {string} [stack] - Error stack trace
 * @property {number} [status] - HTTP status code
 */

/**
 * SvelteKit server API endpoint to fetch user roles from a WordPress backend.
 * @param {import('@sveltejs/kit').RequestEvent} event - The request event.
 */
export async function GET({ url, cookies }) {
    console.log('🚀 [Get Role API] Request received');

    // Get the JWT token from cookies
    const token = cookies.get('jwt_token');
    if (!token) {
        console.error('❌ [Get Role API] Missing JWT token in cookies');
        throw error(401, 'Authentication required - Please log in again');
    }
    console.log('🔑 [Get Role API] JWT token retrieved from cookies');

    // Get the `id` query parameter from the request URL
    const userId = url.searchParams.get('id');
    console.log('🔍 [Get Role API] Request for userId:', userId);

    // Validate the user ID
    if (!userId) {
        console.warn('⚠️ [Get Role API] Missing userId in request.');
        throw error(400, 'User ID is required');
    }

    try {
        // Fetch roles from the WordPress API
        const apiUrl = `https://wp.tributestream.com/wp-json/tributestream/v1/getRole?id=${userId}`;
        console.log('🌍 [Get Role API] Fetching from WordPress API:', apiUrl);
        
        const wpResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('🛬 [Get Role API] Response received from WordPress API');
        console.log('   Status:', wpResponse.status);

        // Check if the response is okay
        if (!wpResponse.ok) {
            const errorData = await wpResponse.json();
            console.error('❌ [Get Role API] Error from WordPress API:', errorData);
            throw error(
                wpResponse.status,
                errorData.message || 'Failed to fetch roles'
            );
        }

        // Parse the WordPress API response
        const data = await wpResponse.json();
        console.log('📝 [Get Role API] Parsed response:', data);

        // Ensure roles is always an array
        const roles = Array.isArray(data.roles) ? data.roles : [];
        
        // Check if user is admin based on roles
        const isAdmin = roles.includes('administrator');

        console.log('✅ [Get Role API] Processed response:', {
            user_id: data.user_id,
            roles,
            isAdmin
        });
        
        // Return the user roles with admin status
        return json({
            user_id: data.user_id,
            roles,
            isAdmin
        });
    } catch (/** @type {WordPressError|unknown} */ err) {
        const error_obj = /** @type {WordPressError} */ (err);
        console.error('🚨 [Get Role API] Error:', {
            message: error_obj.message || 'Unknown error occurred',
            stack: error_obj.stack,
            status: error_obj.status || 500
        });
        
        throw error(
            error_obj.status || 500,
            error_obj.message || 'An unexpected error occurred'
        );
    }
}

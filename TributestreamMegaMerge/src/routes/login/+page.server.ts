import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, cookies, fetch }) => {
        console.log('🚀 [Login Action] Triggered default action.');

        // Step 1: Extract form data
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');
        console.log('📝 [Login Action] Form data extracted:', { username, password });

        // Check for missing credentials
        if (!username || !password) {
            console.warn('⚠️ [Login Action] Missing username or password.');
            return fail(400, { error: 'Both username and password are required.' });
        }

        let result;
        let roles: string[] = []; // Fix: Ensure `roles` is defined before using it
        let userMeta: Record<string, any> = {}; // Initialize user meta data

        try {
            console.log('🔄 [Login Action] Sending login request to /api/auth...');

            // Step 2: Send login request to API
            const response = await fetch('/api/auth', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('🛬 [Login Action] Received response from /api/auth. Status Code:', response.status);

            // Step 3: Parse the response
            result = await response.json();
            console.log('📝 [Login Action] Parsed response JSON:', result);

            // Ensure the login was successful and user_id is available
            if (!response.ok || !result.user_id) {
                console.error('❌ [Login Action] Login failed or missing user_id.');
                return fail(400, { error: result.message || 'Login failed.' });
            }

            console.log('✅ [Login Action] Extracted user_id:', result.user_id);

            // Step 4: Set JWT token cookie (HTTP-only)
            cookies.set('jwt_token', result.token, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 24 hours
            });

            console.log('✅ [Login Action] JWT cookie set');

 
            // console.log('🛬 [Login Action] Received response from /api/getRole. Status Code:', rolesResponse.status);
             const rolesData = result.roles;
             console.log('📝 [Login Action] Parsed roles response:', rolesData);

 

            // Step 6: Fetch User Meta Data
            console.log(`🔄 [Login Action] Fetching user meta data from /api/user-meta?user_id=${result.user_id}...`);
            const metaResponse = await fetch(`/api/user-meta?user_id=${result.user_id}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${result.token}` // Include JWT token for authentication
                }
            });

            if (metaResponse.ok) {
                const metaData = await metaResponse.json();
                userMeta = metaData.meta_data || {};
                console.log('✅ [Login Action] User meta data fetched:', userMeta);
            } else {
                console.warn('⚠️ [Login Action] Failed to fetch user meta data. Continuing with empty meta data.');
            }

            // Step 7: Set user data with roles and meta data (client-accessible)
            cookies.set('user', JSON.stringify({
                displayName: result.user_display_name,
                email: result.user_email,
                nicename: result.user_nicename,
                rolesData,
                isAdmin: rolesData.includes('administrator'),
                userMeta // Include user meta data in the cookie
            }), {
                path: '/',
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 24 hours
            });

        } catch (error) {
            console.error('🚨 [Login Action] Error during login:', error);
            return fail(500, { error: 'Internal server error' });
        }

        // Define redirect path based on user role
        let redirectPath = '/dashboard'; // Default user redirect
        if (roles.includes('administrator')) {
            redirectPath = '/admin-dashboard';
        } else if (roles.includes('editor')) {
            redirectPath = '/editor-dashboard'; // Redirect editors
        }

        console.log(`🚀 [Login Action] Redirecting user to: ${redirectPath}`);
        throw redirect(303, redirectPath);
    }
};

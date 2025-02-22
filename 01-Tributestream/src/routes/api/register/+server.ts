/**
 * SvelteKit POST endpoint for registering and authenticating users against a WordPress backend.
 * This endpoint will:
 *   1. Register a new user with WordPress
 *   2. Authenticate the user to get JWT token
 *   3. Use JWT token to fetch user roles & capabilities
 *   4. Return combined data (token, user info, roles, capabilities)
 */

import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { WPUserData } from '$lib/types/user-metadata';
import { storeAuthData } from '$lib/utils/auth';

// Registration request data interface
interface RegisterData {
    username: string;
    email: string;
    password: string;
    meta?: {
        [key: string]: any;
    };
}

// Registration validation
function validateRegistrationData(data: RegisterData): { isValid: boolean; message?: string } {
    if (!data.username || !data.email || !data.password) {
        return { isValid: false, message: 'Username, email, and password are required' };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return { isValid: false, message: 'Invalid email format' };
    }

    // Username validation (alphanumeric, underscores, min 3 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(data.username)) {
        return { 
            isValid: false, 
            message: 'Username must be at least 3 characters and contain only letters, numbers, and underscores' 
        };
    }

    // Password validation (min 8 chars, at least one number and special char)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(data.password)) {
        return { 
            isValid: false, 
            message: 'Password must be at least 8 characters and contain at least one letter, one number, and one special character' 
        };
    }

    return { isValid: true };
}

export async function POST({ request }: RequestEvent) {
    console.log('🚀 [Register API] POST request received.');

    try {
        const data = await request.json() as RegisterData;
        
        console.log('📝 [Register API] Parsed request JSON:');
        console.log('   Username:', data.username);
        console.log('   Email:', data.email);

        // Validate registration data
        const validation = validateRegistrationData(data);
        if (!validation.isValid) {
            console.warn('⚠️ [Register API] Validation failed:', validation.message);
            return json(
                {
                    error: true,
                    message: validation.message
                },
                { status: 400 }
            );
        }

        // Step 1: Register the user
        console.log('🔄 [Register API] Registering new user...');
        try {
            const registerResponse = await fetch(
                'https://wp.tributestream.com/wp-json/tributestream/v1/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: data.username,
                        email: data.email,
                        password: data.password,
                        meta: data.meta
                    })
                }
            );

            if (!registerResponse.ok) {
                const errorData = await registerResponse.json().catch(() => ({}));
                console.error('❌ [Register API] Registration failed:', {
                    status: registerResponse.status,
                    statusText: registerResponse.statusText,
                    error: errorData
                });
                return json(
                    {
                        error: true,
                        message: errorData.message || `Registration failed: ${registerResponse.statusText}`
                    },
                    { status: registerResponse.status }
                );
            }

            const registerResult = await registerResponse.json();
            console.log('✅ [Register API] User registered successfully.');

            // Step 2: Authenticate the newly registered user
            console.log('🔄 [Register API] Authenticating new user...');
            const wpAuthResponse = await fetch('https://wp.tributestream.com/wp-json/jwt-auth/v1/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    username: data.username, 
                    password: data.password 
                })
            });

            const wpAuthData = await wpAuthResponse.json();

            if (!wpAuthResponse.ok) {
                console.error('❌ [Register API] Authentication failed after registration.');
                return json(
                    {
                        error: true,
                        message: wpAuthData.message || 'Authentication failed after registration'
                    },
                    { status: wpAuthResponse.status }
                );
            }

            // Step 3: Fetch roles and capabilities
            console.log('🔄 [Register API] Fetching user roles & capabilities...');
            let roles: string[] = [];
            let capabilities: Record<string, boolean> = {};
            let user_id = registerResult.user_id;

            try {
                const rolesCapResponse = await fetch(
                    'https://wp.tributestream.com/wp-json/tributestream/v1/user-cap',
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${wpAuthData.token}`
                        }
                    }
                );

                const rolesCapData = await rolesCapResponse.json();
                console.log('📝 [Register API] Received roles & capabilities:');
                console.log('   Response Data:', JSON.stringify(rolesCapData, null, 2));

                if (rolesCapResponse.ok && rolesCapData.roles && rolesCapData.capabilities) {
                    roles = rolesCapData.roles;
                    capabilities = rolesCapData.capabilities;
                    if (rolesCapData.user_id) {
                        user_id = rolesCapData.user_id;
                    }
                } else {
                    console.warn('⚠️ [Register API] Failed to retrieve roles or capabilities.');
                }
            } catch (error) {
                console.error('🚨 [Register API] Error fetching roles/capabilities:', error);
            }

            // Create user data object
            const userData: WPUserData = {
                displayName: wpAuthData.user_display_name,
                email: wpAuthData.user_email,
                nicename: wpAuthData.user_nicename,
                roles,
                capabilities,
                isAdmin: roles.includes('administrator'),
                metaResult: {
                    success: true,
                    message: 'Registration successful',
                    user_id,
                    meta_key: 'registration',
                    meta_value: wpAuthData.token
                },
                token: wpAuthData.token
            };

            // Store authentication data
            storeAuthData(wpAuthData.token, userData);

            // Return comprehensive response
            console.log('✅ [Register API] Registration and authentication complete.');
            return json(
                {
                    success: true,
                    token: wpAuthData.token,
                    user_id,
                    user_display_name: wpAuthData.user_display_name,
                    user_email: wpAuthData.user_email,
                    user_nicename: wpAuthData.user_nicename,
                    roles,
                    capabilities
                },
                { status: 201 }
            );
        } catch (error) {
            console.error('🚨 [Register API] WordPress registration error:', error);
            return json(
                {
                    error: true,
                    message: error instanceof Error ? error.message : 'Registration failed'
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('🚨 [Register API] Registration endpoint error:', error);
        return json(
            {
                error: true,
                message: 'An unexpected error occurred during registration'
            },
            { status: 500 }
        );
    }
}
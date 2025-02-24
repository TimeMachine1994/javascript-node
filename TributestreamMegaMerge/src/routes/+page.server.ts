import { fail, type Actions } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Generates a secure random password
 * @returns {string} A secure random password
 */
function generatePassword(): string {
    console.log(`[${new Date().toISOString()}] [FUNCTION] generatePassword() called`);
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    console.log(`[${new Date().toISOString()}] [FUNCTION] generatePassword() completed - Length: ${password.length}`);
    return password;
}

/**
 * Log timestamp helper function
 * @returns {string} Formatted timestamp for logging
 */
function logTime(): string {
    return `[${new Date().toISOString()}]`;
}

export const actions: Actions = {
    create: async ({ request, cookies, fetch }: RequestEvent) => {
        console.log(`${logTime()} ========================================================`);
        console.log(`${logTime()} [ACTION] create() - STARTED`);
        console.log(`${logTime()} [REQUEST] Method: ${request.method}, URL: ${request.url}`);
        console.log(`${logTime()} [HEADERS] Content-Type: ${request.headers.get('content-type')}`);
        
        try {
            console.log(`${logTime()} ===> Starting form submission process...`);
            console.log(`${logTime()} [PROCESS] Step 1/7: Extracting form data`);

            // Get form data
            const formData = await request.formData();
            console.log(`${logTime()} [FORM] Raw form data keys:`, [...formData.keys()]);
            
            // Map the form field names to our expected data structure
            const data = {
                lovedOneName: formData.get('lovedOneName') as string,
                pointOfContactName: formData.get('fullName') as string,
                pointOfContactEmail: formData.get('emailAddress') as string,
                pointOfContactPhone: formData.get('phoneNumber') as string,
                slug: formData.get('slug') as string,
            };

            console.log(`${logTime()} [FORM] Processed form data:`, JSON.stringify(data, null, 2));
            console.log(`${logTime()} [VALIDATION] Checking required fields...`);
            
            // Validate required fields
            const requiredFields = ['lovedOneName', 'pointOfContactEmail', 'slug'];
            for (const field of requiredFields) {
                if (!data[field as keyof typeof data]) {
                    console.error(`${logTime()} [VALIDATION] Missing required field: ${field}`);
                    return fail(400, {
                        error: true,
                        message: `Missing required field: ${field}`
                    });
                }
            }
            
            console.log(`${logTime()} [VALIDATION] All required fields present`);
            console.log(`${logTime()} [PROCESS] Step 2/7: Logging out existing user`);

            // Logout user first to ensure clean state
            console.log(`${logTime()} [API] Sending logout request to /api/logout`);
            const logoutResponse = await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            console.log(`${logTime()} [API] Logout response status: ${logoutResponse.status}, statusText: ${logoutResponse.statusText}`);
            console.log(`${logTime()} [API] Logout response headers:`, Object.fromEntries([...logoutResponse.headers.entries()]));

            if (!logoutResponse.ok) {
                console.error(`${logTime()} [ERROR] Logout failed: ${logoutResponse.statusText}`);
                console.error(`${logTime()} [ERROR] Will continue despite logout failure`);
            } else {
                console.log(`${logTime()} [SUCCESS] Logout successful`);
            }

            console.log(`${logTime()} [PROCESS] Step 3/7: Generating secure password`);
            // Generate secure password
            const password = generatePassword();
            console.log(`${logTime()} [SECURITY] Password generated with length: ${password.length}`);
            console.log(`${logTime()} [SECURITY] First 2 chars of password: ${password.substring(0, 2)}...`);

            console.log(`${logTime()} [PROCESS] Step 4/7: Registering new user`);
            // Register user
            console.log(`${logTime()} [API] Registering user with email: ${data.pointOfContactEmail}`);
            
            const registerPayload = {
                username: data.pointOfContactEmail,
                email: data.pointOfContactEmail,
                password: password
            };
            console.log(`${logTime()} [API] Register payload:`, JSON.stringify(registerPayload, null, 2).replace(password, '********'));
            
            const registerResponse = await fetch(`/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerPayload)
            });

            console.log(`${logTime()} [API] Register response status: ${registerResponse.status}, statusText: ${registerResponse.statusText}`);
            console.log(`${logTime()} [API] Register response headers:`, Object.fromEntries([...registerResponse.headers.entries()]));
            
            if (!registerResponse.ok) {
                const registerError = await registerResponse.json();
                console.error(`${logTime()} [ERROR] Registration failed:`, JSON.stringify(registerError, null, 2));
                console.error(`${logTime()} [ERROR] Registration error code:`, registerError.code || 'No error code');
                return fail(registerResponse.status, {
                    error: true,
                    message: registerError.message || 'Registration failed'
                });
            }

            const registerResult = await registerResponse.json();
            console.log(`${logTime()} [SUCCESS] User registered successfully:`, JSON.stringify(registerResult, null, 2));
            console.log(`${logTime()} [DATA] User ID: ${registerResult.user_id}`);
            const userId = registerResult.user_id;

            console.log(`${logTime()} [PROCESS] Step 5/7: Authenticating user`);
            // Authenticate user
            console.log(`${logTime()} [API] Authenticating user with email: ${data.pointOfContactEmail}`);
            
            const authPayload = {
                username: data.pointOfContactEmail,
                password: password
            };
            console.log(`${logTime()} [API] Auth payload:`, JSON.stringify(authPayload, null, 2).replace(password, '********'));
            
            const authResponse = await fetch(`/api/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authPayload)
            });

            console.log(`${logTime()} [API] Authentication response status: ${authResponse.status}, statusText: ${authResponse.statusText}`);
            console.log(`${logTime()} [API] Authentication response headers:`, Object.fromEntries([...authResponse.headers.entries()]));

            const authResult = await authResponse.json();
            if (!authResponse.ok || authResult.error) {
                console.error(`${logTime()} [ERROR] Authentication failed:`, JSON.stringify(authResult, null, 2));
                console.error(`${logTime()} [ERROR] Authentication error code:`, authResult.code || 'No error code');
                return fail(authResponse.status, {
                    error: true,
                    message: authResult.message || 'Authentication failed'
                });
            }

            console.log(`${logTime()} [SUCCESS] Authentication successful. Token received.`);
            console.log(`${logTime()} [DATA] Token length: ${authResult.token?.length || 0}`);
            console.log(`${logTime()} [DATA] User display name: ${authResult.user_display_name}`);
            console.log(`${logTime()} [DATA] User email: ${authResult.user_email}`);
            console.log(`${logTime()} [DATA] User roles:`, authResult.roles || []);

            const token = authResult.token;

            console.log(`${logTime()} [PROCESS] Step 6/7: Setting authentication cookies`);
            // Store tokens in cookies with explicit options
            console.log(`${logTime()} [COOKIES] Setting jwt_token cookie (httpOnly, secure, 7 days)`);
            cookies.set('jwt_token', token, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
            console.log(`${logTime()} [COOKIES] jwt_token cookie set successfully`);

            console.log(`${logTime()} [COOKIES] Setting user_id cookie (httpOnly, secure, 7 days)`);
            console.log(`${logTime()} [DATA] User ID for cookie: ${userId || 'undefined'}`);
            
            // Make sure userId is a string
            const userIdString = userId ? String(userId) : '';
            
            cookies.set('user_id', userIdString, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
            console.log(`${logTime()} [COOKIES] user_id cookie set successfully with value: ${userIdString}`);

            const userCookieData = {
                displayName: authResult.user_display_name,
                email: authResult.user_email,
                nicename: authResult.user_nicename,
                roles: authResult.roles || [],
                isAdmin: (authResult.roles || []).includes('administrator')
            };
            console.log(`${logTime()} [COOKIES] Setting user cookie (non-httpOnly, secure, 24 hours)`);
            console.log(`${logTime()} [COOKIES] User cookie data:`, JSON.stringify(userCookieData, null, 2));
            
            cookies.set('user', JSON.stringify(userCookieData), {
                path: '/',
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 24 hours
            });
            console.log(`${logTime()} [COOKIES] user cookie set successfully`);

            console.log(`${logTime()} [PROCESS] Step 7/7: Creating tribute`);
            // Create tribute
            console.log(`${logTime()} [API] Creating tribute for: ${data.lovedOneName}, slug: ${data.slug}`);
            
            // Based on the API documentation and error messages, we're keeping only the parameters
            // that the WordPress API endpoint accepts for tribute creation
            const tributePayload = {
                slug: data.slug,
                loved_one_name: data.lovedOneName,
                user_id: userId,
                phone_number: data.pointOfContactPhone || ''
            };
            
            console.log(`${logTime()} [DEBUG] Using minimal payload for tribute creation to avoid API rejection`);
            console.log(`${logTime()} [API] Tribute payload:`, JSON.stringify(tributePayload, null, 2));
            
            const tributeResponse = await fetch(`/api/tributes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(tributePayload)
            });

            console.log(`${logTime()} [API] Tribute creation response status: ${tributeResponse.status}, statusText: ${tributeResponse.statusText}`);
            console.log(`${logTime()} [API] Tribute creation response headers:`, Object.fromEntries([...tributeResponse.headers.entries()]));

            const tributeResult = await tributeResponse.json();
            if (!tributeResponse.ok || tributeResult.error) {
                console.error(`${logTime()} [ERROR] Failed to create tribute:`, JSON.stringify(tributeResult, null, 2));
                console.error(`${logTime()} [ERROR] Tribute creation error code:`, tributeResult.code || 'No error code');
                return fail(tributeResponse.status, {
                    error: true,
                    message: tributeResult.message || 'Failed to create tribute'
                });
            }

            console.log(`${logTime()} [SUCCESS] Tribute created successfully:`, JSON.stringify(tributeResult, null, 2));
            console.log(`${logTime()} [DATA] Tribute ID: ${tributeResult.id || 'No ID'}`);
            console.log(`${logTime()} [DATA] Tribute slug: ${tributeResult.slug || data.slug}`);
            
            const result = {
                success: true,
                tribute: tributeResult,
                message: 'Memorial created successfully'
            };
            
            console.log(`${logTime()} [ACTION] create() - COMPLETED SUCCESSFULLY`);
            console.log(`${logTime()} [RESULT] Returning:`, JSON.stringify(result, null, 2));
            console.log(`${logTime()} ========================================================`);
            
            return result;

        } catch (error) {
            console.error(`${logTime()} [ERROR] Unexpected error during form submission:`, error);
            console.error(`${logTime()} [ERROR] Error name: ${error instanceof Error ? error.name : 'Unknown'}`);
            console.error(`${logTime()} [ERROR] Error message: ${error instanceof Error ? error.message : 'Unknown'}`);
            console.error(`${logTime()} [ERROR] Error stack: ${error instanceof Error ? error.stack : 'No stack trace'}`);
            console.error(`${logTime()} [ACTION] create() - FAILED`);
            console.error(`${logTime()} ========================================================`);
            
            return fail(500, {
                error: true,
                message: 'An unexpected error occurred'
            });
        }
    }
};

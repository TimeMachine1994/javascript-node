import type { Actions } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
// Function to generate a secure password that meets WordPress requirements
function generatePassword(): string {
    // Ensure at least one of each required character type
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Get one of each required type
    const getLowercase = () => lowercase[Math.floor(Math.random() * lowercase.length)];
    const getUppercase = () => uppercase[Math.floor(Math.random() * uppercase.length)];
    const getNumber = () => numbers[Math.floor(Math.random() * numbers.length)];
    const getSpecial = () => special[Math.floor(Math.random() * special.length)];
    
    // Start with required characters
    let password = getLowercase() + getUppercase() + getNumber() + getSpecial();
    
    // Add additional random characters to reach desired length
    const allChars = lowercase + uppercase + numbers + special;
    const remainingLength = 16 - password.length;
    
    for (let i = 0; i < remainingLength; i++) {
        const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
        // Insert at random position to avoid patterns
        const position = Math.floor(Math.random() * (password.length + 1));
        password = password.slice(0, position) + randomChar + password.slice(position);
    }
    
    return password;
}

export const actions = {
    default: async ({ request, cookies, fetch }: RequestEvent) => {
        let password = '';
        let userId = '';
        let token = '';
       
        const formData = await request.formData();
        const fullName = formData.get('fullName');
        const phoneNumber = formData.get('phoneNumber');
        const emailAddress = formData.get('emailAddress');
        const customSlug = formData.get('customSlug');

 
        try {
            console.log('Starting form submission process...');
            
            // Logout user first to ensure clean state
            console.log('Logging out any existing user...');
            const logoutResponse = await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!logoutResponse.ok) {
                console.error('Logout failed:', logoutResponse.statusText);
                // Continue with form submission even if logout fails
                console.warn('Proceeding with form submission despite logout failure');
            } else {
                console.log('Logout successful');
            }



            password = generatePassword();
            const formData = await request.formData();
            const data = {
                fullName: formData.get('fullName'),
                phoneNumber: formData.get('phoneNumber'),
                emailAddress: formData.get('emailAddress'),
                customSlug: formData.get('customSlug'),
                password
            }fetch(`/api/user-meta`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: userId,
                    meta_key: 'homepage_form_data',
                    meta_value: JSON.stringify(data)
                })
            }),
            // Check memorial form data save

     if (!data.email || !data.directorFirstName || !data.directorLastName || !data.locationName) {
                return fail(400, { error: true, message: 'Required fields are missing.' });
            }
        
            console.log('Registering user...');
            // Register user
            const registerResponse = await fetch(`/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: data.email,
                    email: data.email,
                    password: password
                })
            });
            const registerResult = await registerResponse.json();
                        
                        if (!registerResponse.ok || registerResult.error) {
                            console.error('Registration failed:', registerResult);
                            
                            // Handle specific WordPress registration errors
                            let errorMessage = registerResult.message || 'Registration failed';
                            
                            if (errorMessage.includes('username is already registered') || 
                                errorMessage.includes('email address is already registered')) {
                                errorMessage = 'This email address is already registered. Please use a different email or try logging in.';
                            } else if (errorMessage.includes('Missing required fields')) {
                                errorMessage = 'Please fill in all required fields.';
                            } else if (errorMessage.includes('Invalid username')) {
                                errorMessage = 'The email address contains invalid characters. Please use a different email address.';
                            } else if (errorMessage.includes('Invalid email address')) {
                                errorMessage = 'Please enter a valid email address.';
                            }
                            
                            return fail(registerResponse.status, { 
                                error: true, 
                                message: errorMessage,
                                code: registerResult.code || 'registration_failed'
                            });
                        }
            
                        userId = registerResult.user_id.toString();
                        console.log('User registered successfully. User ID:', userId);
            
                        console.log('Authenticating user...');
                        // Authenticate user
                        const authResponse = await fetch(`/api/auth`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                username: data.email,
                                password: password
                            })
                        });
            
                        const authResult = await authResponse.json();
                        
                        if (!authResponse.ok || authResult.error) {
                            console.error('Authentication failed:', authResult);
                            return fail(authResponse.status, { 
                                error: true, 
                                message: authResult.message || 'Authentication failed' 
                            });
                        }
            
                        token = authResult.token;
                        console.log('Authentication successful. Token received.');
            
                        // Store tokens in cookies with explicit options
                        cookies.set('jwt_token', token, { 
                            path: '/',
                            httpOnly: true,
                            secure: true,
                            sameSite: 'strict',
                            maxAge: 60 * 60 * 24 * 7 // 7 days
                        });
            
                        cookies.set('user_id', userId, {
                            path: '/',
                            httpOnly: true,
                            secure: true,
                            sameSite: 'strict',
                            maxAge: 60 * 60 * 24 * 7 // 7 days
                        });
            
                        console.log('Cookies set successfully');

                         console.log('Metadata saved successfully');
                        
                                    // Define roles array
                                    const roles = authResult.roles || [];
                                    // Step 7: Set user data with roles and meta data (client-accessible)
                                    cookies.set('user', JSON.stringify({
                                        displayName: authResult.user_display_name,
                                        email: authResult.user_email,
                                        nicename: authResult.user_nicename,
                                        roles : authResult.roles,
                                        isAdmin: roles.includes('administrator'),
                                        metaResult: metaResult // Include user meta data in the cookie
                                    }), {
                                        path: '/',
                                        secure: true,
                                        sameSite: 'strict',
                                        maxAge: 60 * 60 * 24 // 24 hours
                                    });
                        
                                    console.log('User cookie set:', {
                                                    displayName: authResult.user_display_name,
                                                    email: authResult.user_email,
                                                    nicename: authResult.user_nicename,
                                                    roles: authResult.roles,
                                                    isAdmin: roles.includes('administrator'),
                                                    metaResult: metaResult
                                                });
                                    
                                    //create tribute
                                    console.log('Creating tribute...');
                                    // Create tribute
                                    const slug = generateSlug(data.deceasedFirstName, data.deceasedLastName);
                                    const tributePayload = {
                                        loved_one_name: `${data.deceasedFirstName} ${data.deceasedLastName}`,
                                        slug,
                                        user_id: userId,
                                        phone_number: data.phone
                                    };
                        
                                    const tributeResponse = await fetch(`/api/tributes`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify(tributePayload)
                                    });
                        
                                    const tributeResult = await tributeResponse.json();
                                    
                                    if (!tributeResponse.ok || tributeResult.error) {
                                        console.error('Failed to create tribute:', tributeResult);
                                        return fail(tributeResponse.status, { 
                                            error: true, 
                                            message: tributeResult.message || 'Failed to create tribute' 
                                        });
                                    }
                        
                                    console.log('Tribute created successfully');
                                    console.log('Generating email content...');
                 
                         // Verify cookies are set
                         const jwtCookie = cookies.get('jwt_token');
                         const userIdCookie = cookies.get('user_id');
                 
                         if (!jwtCookie || !userIdCookie) {
                             console.error('Cookie verification failed:', {
                                 hasJwtCookie: !!jwtCookie,
                                 hasUserIdCookie: !!userIdCookie
                             });
                             return fail(500, {
                                 error: true,
                                 message: 'Authentication failed after form submission'
                             });
                         }
                                    
}  
        console.log('Form submission completed successfully. Redirecting to confirmation page...');
        // Throw redirect after successful form submission and cookie verification
     }
} satisfies Actions;

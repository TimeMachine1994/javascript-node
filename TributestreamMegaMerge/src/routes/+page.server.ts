import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import type { TributeCreateRequest } from '$lib/types/api';

 
function generatePassword(): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const getLowercase = () => lowercase[Math.floor(Math.random() * lowercase.length)];
    const getUppercase = () => uppercase[Math.floor(Math.random() * uppercase.length)];
    const getNumber = () => numbers[Math.floor(Math.random() * numbers.length)];
    const getSpecial = () => special[Math.floor(Math.random() * special.length)];
    
    let password = getLowercase() + getUppercase() + getNumber() + getSpecial();
    
    const allChars = lowercase + uppercase + numbers + special;
    const remainingLength = 16 - password.length;
    
    for (let i = 0; i < remainingLength; i++) {
        const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
        const position = Math.floor(Math.random() * (password.length + 1));
        password = password.slice(0, position) + randomChar + password.slice(position);
    }
    
    return password;
}

function validateFormData(data: TributeCreateRequest): { isValid: boolean; error?: string } {
    if (!data.lovedOneName?.trim()) {
        return { isValid: false, error: 'Loved one name is required' };
    }
    if (!data.point_of_contact_name?.trim()) {
        return { isValid: false, error: 'Contact name is required' };
    }
    if (!data.point_of_contact_email?.trim()) {
        return { isValid: false, error: 'Contact email is required' };
    }
    if (!data.point_of_contact_phone?.trim()) {
        return { isValid: false, error: 'Contact phone is required' };
    }
    return { isValid: true };
}

 
export const actions: Actions = {
    create: async ({ request, cookies, fetch }: RequestEvent) => {
        try {
            console.log('Starting form submission process...');
            
            // Get form data
            const formData = await request.formData();
           const data = {
                lovedOneName: formData.get('lovedOneName') as string,
                pointOfContactName: formData.get('pointOfContactName') as string,
                pointOfContactEmail: formData.get('pointOfContactEmail') as string,
                pointOfContactPhone: formData.get('pointOfContactPhone') as string,
                tribute: formData.get('searchQuery') as string,
             };

            // Validate form data
            const validation = validateFormData(data);
            if (!validation.isValid) {
                return fail(400, { 
                    error: true, 
                    message: validation.error 
                });
            }

            // Logout user first to ensure clean state
            console.log('Logging out any existing user...');
            const logoutResponse = await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!logoutResponse.ok) {
                console.error('Logout failed:', logoutResponse.statusText);
                console.warn('Proceeding with form submission despite logout failure');
            } else {
                console.log('Logout successful');
            }

            // Generate secure password
            const password = generatePassword();
            
            console.log('Registering user...');
            // Register user
            const registerResponse = await fetch(`/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug:
                    username: data.point_of_contact_email,
                    email: data.point_of_contact_email,
                    password: password
                })
            });

            if (!registerResponse.ok) {
                const registerError = await registerResponse.json();
                console.error('Registration failed:', registerError);
                return fail(registerResponse.status, {
                    error: true,
                    message: registerError.message || 'Registration failed'
                });
            }

            const registerResult = await registerResponse.json();
            const userId = registerResult.id;
            
            console.log('Authenticating user...');
            // Authenticate user
            const authResponse = await fetch(`/api/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: data.point_of_contact_email,
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

            const token = authResult.token;
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

            // Store user data in a client-accessible cookie
            cookies.set('user', JSON.stringify({
                displayName: authResult.user_display_name,
                email: authResult.user_email,
                nicename: authResult.user_nicename,
                roles: authResult.roles || [],
                isAdmin: (authResult.roles || []).includes('administrator')
            }), {
                path: '/',
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 24 hours
            });

            console.log('Cookies set successfully');

            // Create tribute
            console.log('Creating tribute...');
            const tributeResponse = await fetch(`/api/tributes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    loved_one_name: data.lovedOneName,
                    user_id: userId,
                    phone_number: data.point_of_contact_phone
                })
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

            // Return success response with created tribute data
            return {
                success: true,
                tribute: tributeResult,
                message: 'Memorial created successfully'
            };

        } catch (error) {
            console.error('Unexpected error during form submission:', error);
            return fail(500, {
                error: true,
                message: 'An unexpected error occurred'
            });
        }
    }
};

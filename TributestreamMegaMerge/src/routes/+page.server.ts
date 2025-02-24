import type { PageServerLoad } from './$types';
import type { Tribute } from '$lib/types/api';
import type { Actions } from './$types';
import type { TributeCreateRequest } from '$lib/types/api';

import type { RequestEvent } from '@sveltejs/kit';
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
    create: async ({ request, cookies, fetch }: RequestEvent) => {
        let password = '';
        let userId = '';
        let token = '';
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

                lovedOneName: formData.get('searchQuery') as string,
                point_of_contact_name: formData.get('fullName') as string,
                point_of_contact_phone: formData.get('phoneNumber') as string,
                point_of_contact_email: formData.get('emailAddress') as string,
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
    }
}

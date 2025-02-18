import { json } from '@sveltejs/kit';

interface RegisterData {
    username: string;
    email: string;
    password: string;
    meta?: {
        [key: string]: any;
    };
}

export async function POST({ request }) {
    try {
        const data = await request.json() as RegisterData;
        
        if (!data.username || !data.email || !data.password) {
            return json(
                {
                    error: true,
                    message: 'Username, email, and password are required'
                },
                { status: 400 }
            );
        }

        try {
            const response = await fetch(
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

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Registration failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                return json(
                    {
                        error: true,
                        message: errorData.message || `Registration failed: ${response.statusText}`
                    },
                    { status: response.status }
                );
            }

            const result = await response.json();
            return json(
                {
                    success: true,
                    user_id: result.user_id
                },
                { status: 201 }
            );
        } catch (error) {
            console.error('WordPress registration error:', error);
            return json(
                {
                    error: true,
                    message: error instanceof Error ? error.message : 'Registration failed'
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Registration endpoint error:', error);
        return json(
            {
                error: true,
                message: 'An unexpected error occurred during registration'
            },
            { status: 500 }
        );
    }
}

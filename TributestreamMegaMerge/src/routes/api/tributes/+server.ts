import { json } from '@sveltejs/kit';

interface Tribute {
    id: number;
    title: string;
    content: string;
    status: string;
    date: string;
    // Add other tribute properties as needed
}

interface PaginatedResponse<T> {
    items: T[];
    total: number;
    total_pages: number;
    current_page: number;
}

export async function GET({ url }) {
    try {
        const page = url.searchParams.get('page') || '1';
        const per_page = url.searchParams.get('per_page') || '10';
        const search = url.searchParams.get('search') || '';
        
        try {
            const response = await fetch(
                `https://wp.tributestream.com/wp-json/tributestream/v1/tributes?page=${page}&per_page=${per_page}&search=${search}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Tributes fetch failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                return json(
                    {
                        error: true,
                        message: errorData.message || `Failed to fetch tributes: ${response.statusText}`
                    },
                    { status: response.status }
                );
            }

            const data = await response.json() as PaginatedResponse<Tribute>;
            return json({ success: true, ...data });
        } catch (error) {
            console.error('WordPress tributes fetch error:', error);
            return json(
                {
                    error: true,
                    message: error instanceof Error ? error.message : 'Failed to fetch tributes'
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Tributes GET endpoint error:', error);
        return json(
            {
                error: true,
                message: 'An unexpected error occurred while fetching tributes'
            },
            { status: 500 }
        );
    }
}

export async function POST({ request }) {
    try {
        const token = request.headers.get('Authorization');
        if (!token) {
            return json(
                {
                    error: true,
                    message: 'Authorization token is required'
                },
                { status: 401 }
            );
        }

        try {
            const data = await request.json();
            console.log(`[${new Date().toISOString()}] [API] Tribute creation payload:`, JSON.stringify(data, null, 2));
            console.log(`[${new Date().toISOString()}] [API] Using token (first 10 chars): ${token.substring(0, 10)}...`);
            
            const response = await fetch(
                'https://wp.tributestream.com/wp-json/tributestream/v1/tributes',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            );

            console.log(`[${new Date().toISOString()}] [API] WordPress response status: ${response.status}, statusText: ${response.statusText}`);
            console.log(`[${new Date().toISOString()}] [API] WordPress response headers:`, Object.fromEntries([...response.headers.entries()]));

            // Get the raw response text first
            const responseText = await response.text();
            console.log(`[${new Date().toISOString()}] [API] WordPress raw response:`, responseText);

            if (!response.ok) {
                let errorData: Record<string, any> = {};
                try {
                    errorData = JSON.parse(responseText);
                } catch (parseError) {
                    console.error(`[${new Date().toISOString()}] [API] Failed to parse error response:`, parseError);
                    errorData = { unparseable_response: responseText.substring(0, 200) };
                }
                
                console.error(`[${new Date().toISOString()}] [API] Tribute creation failed:`, {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                
                return json(
                    {
                        error: true,
                        message: errorData.message || `Failed to create tribute: ${response.statusText}`,
                        details: errorData
                    },
                    { status: response.status }
                );
            }

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error(`[${new Date().toISOString()}] [API] Failed to parse success response:`, parseError);
                return json(
                    {
                        error: true,
                        message: 'Invalid response from WordPress API',
                        raw_response: responseText.substring(0, 200)
                    },
                    { status: 500 }
                );
            }
            return json({ success: true, id: result.id }, { status: 201 });
        } catch (error) {
            console.error('WordPress tribute creation error:', error);
            return json(
                {
                    error: true,
                    message: error instanceof Error ? error.message : 'Failed to create tribute'
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Tributes POST endpoint error:', error);
        return json(
            {
                error: true,
                message: 'An unexpected error occurred while creating tribute'
            },
            { status: 500 }
        );
    }
}

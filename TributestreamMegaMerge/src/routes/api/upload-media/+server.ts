import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    console.log('🚀 [API] Upload media request received');

    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        console.error('❌ [API] Missing or invalid Authorization header');
        throw error(401, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];
    
    try {
        // Validate token with WordPress
        const validationResponse = await fetch('https://wp.tributestream.com/wp-json/jwt-auth/v1/token/validate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!validationResponse.ok) {
            console.error('❌ [API] Token validation failed');
            throw error(401, 'Invalid authentication token');
        }

        // Process the multipart form data
        const formData = await request.formData();
        const files = formData.getAll('files[]');
        
        if (!files.length) {
            console.error('❌ [API] No files received');
            throw error(400, 'No files were uploaded');
        }

        console.log('📦 [API] Processing files:', {
            count: files.length,
            types: files.map(f => (f as File).type)
        });

        // Upload files to WordPress media library
        const uploadResults = await Promise.all(
            files.map(async (file) => {
                const wpFormData = new FormData();
                wpFormData.append('file', file);

                const uploadResponse = await fetch('https://wp.tributestream.com/wp-json/wp/v2/media', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: wpFormData
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(`Failed to upload ${(file as File).name}: ${errorData.message}`);
                }

                const result = await uploadResponse.json();
                return {
                    filename: (file as File).name,
                    url: result.source_url,
                    id: result.id
                };
            })
        );

        console.log('✅ [API] Files uploaded successfully:', {
            count: uploadResults.length,
            files: uploadResults.map(r => r.filename)
        });

        return json({
            success: true,
            message: `Successfully uploaded ${uploadResults.length} files`,
            files: uploadResults
        });

    } catch (err) {
        console.error('💥 [API] Error processing upload:', err);
        
        // Determine if error is from WordPress API
        if (err instanceof Error && err.message.includes('Failed to upload')) {
            throw error(400, err.message);
        }
        
        throw error(500, 'Failed to process file upload');
    }
};
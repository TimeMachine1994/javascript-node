import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { TransferPocRequest } from '../../family-dashboard/poctransfer/types';

export const POST: RequestHandler = async ({ request }) => {
    console.log('🚀 [API] POC transfer request received');

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

        // Parse request body
        const requestData: TransferPocRequest = await request.json();
        console.log('📦 [API] POC transfer request data:', {
            newPocEmail: requestData.newPocEmail,
            currentUserId: requestData.currentUserId
        });

        // Validate request data
        if (!requestData.newPocEmail || !requestData.currentUserId) {
            console.error('❌ [API] Missing required fields');
            throw error(400, 'Missing required fields');
        }

        // Send POC transfer request to WordPress
        const transferResponse = await fetch('https://wp.tributestream.com/wp-json/tributestream/v1/transfer-poc', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                new_poc_email: requestData.newPocEmail,
                current_user_id: requestData.currentUserId
            })
        });

        if (!transferResponse.ok) {
            const errorData = await transferResponse.json();
            console.error('❌ [API] Transfer POC failed:', errorData);
            throw error(transferResponse.status, errorData.message || 'Failed to transfer POC');
        }

        const result = await transferResponse.json();
        console.log('✅ [API] POC transfer successful:', result);

        return json({
            success: true,
            message: 'POC transfer request sent successfully'
        });

    } catch (err) {
        console.error('💥 [API] Error processing POC transfer:', err);
        
        if (err instanceof Error) {
            console.error('💥 [API] Error details:', {
                name: err.name,
                message: err.message,
                stack: err.stack
            });
        }

        // If error is already handled (i.e., thrown by us), re-throw it
        if (err instanceof Error && 'status' in err) {
            throw err;
        }

        throw error(500, 'Failed to process POC transfer request');
    }
};
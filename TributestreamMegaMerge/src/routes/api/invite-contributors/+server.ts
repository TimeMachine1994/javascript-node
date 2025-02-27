import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { InviteRequest, InviteResponse } from '../../family-dashboard/media_invite/types';

export const POST: RequestHandler = async ({ request }) => {
    console.log('🚀 [API] Contributor invitation request received');

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
        const requestData: InviteRequest = await request.json();
        console.log('📦 [API] Invitation request data:', {
            emailCount: requestData.emails.length,
            role: requestData.role,
            hasMessage: !!requestData.message,
            memorialId: requestData.memorialId
        });

        // Validate request data
        if (!requestData.emails.length || !requestData.role || !requestData.memorialId) {
            console.error('❌ [API] Missing required fields');
            throw error(400, 'Missing required fields');
        }

        // Send invitations to WordPress
        const inviteResponse = await fetch('https://wp.tributestream.com/wp-json/tributestream/v1/invite-contributors', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emails: requestData.emails,
                role: requestData.role,
                message: requestData.message,
                memorial_id: requestData.memorialId,
                sender_id: requestData.senderId
            })
        });

        if (!inviteResponse.ok) {
            const errorData = await inviteResponse.json();
            console.error('❌ [API] Invitation failed:', errorData);
            throw error(inviteResponse.status, errorData.message || 'Failed to send invitations');
        }

        const result = await inviteResponse.json();
        console.log('✅ [API] Invitations sent successfully:', {
            totalSent: result.invitations.filter((i: { status: string }) => i.status === 'sent').length,
            totalFailed: result.invitations.filter((i: { status: string }) => i.status === 'failed').length
        });

        return json({
            success: true,
            message: 'Invitations sent successfully',
            invitations: result.invitations
        } satisfies InviteResponse);

    } catch (err) {
        console.error('💥 [API] Error processing invitations:', err);
        
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

        throw error(500, 'Failed to process invitation request');
    }
};

// API endpoint for fetching contributors
export const GET: RequestHandler = async ({ url, request }) => {
    console.log('🚀 [API] Fetch contributors request received');

    const memorial_id = url.searchParams.get('memorial_id');
    if (!memorial_id) {
        throw error(400, 'Memorial ID is required');
    }

    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        console.error('❌ [API] Missing or invalid Authorization header');
        throw error(401, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];

    try {
        // Fetch contributors from WordPress
        const response = await fetch(`https://wp.tributestream.com/wp-json/tributestream/v1/contributors/${memorial_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw error(response.status, errorData.message || 'Failed to fetch contributors');
        }

        const contributors = await response.json();
        return json({ contributors });

    } catch (err) {
        console.error('💥 [API] Error fetching contributors:', err);
        throw error(500, 'Failed to fetch contributors');
    }
};
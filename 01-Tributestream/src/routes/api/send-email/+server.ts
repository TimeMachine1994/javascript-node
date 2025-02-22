/**
 * SvelteKit endpoint for sending emails using SendGrid.
 * This endpoint will:
 *   1. Validate email request data
 *   2. Support template-based emails
 *   3. Handle SendGrid integration
 *   4. Provide proper error handling
 */

import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { sendEmail, type EmailRequest } from '$lib/utils/email';
import { getAuthHeaders } from '$lib/utils/auth';

// Error handling utility
function handleError(err: unknown, defaultStatus = 500): { status: number; message: string } {
    if (err instanceof Error) {
        return {
            status: (err as { status?: number }).status || defaultStatus,
            message: err.message
        };
    }
    return {
        status: defaultStatus,
        message: 'An unknown error occurred'
    };
}

export async function POST({ request }: RequestEvent) {
    console.log('🚀 [Email API] POST request received.');

    try {
        // Get auth headers using our utility
        const headers = getAuthHeaders();
        if (!('Authorization' in headers)) {
            console.error('❌ [Email API] No authorization token found.');
            throw error(401, 'Authentication required');
        }

        try {
            // Parse request body
            const emailRequest = await request.json() as EmailRequest;
            console.log('📝 [Email API] Request body:', {
                to: emailRequest.to,
                subject: emailRequest.subject,
                template: emailRequest.template
            });

            // Send email using our utility
            await sendEmail(emailRequest);

            console.log('✅ [Email API] Email sent successfully');
            return json({
                success: true,
                message: 'Email sent successfully'
            });
        } catch (err) {
            console.error('❌ [Email API] Error sending email:', err);
            const { status, message } = handleError(err, 400);
            throw error(status, message);
        }
    } catch (err) {
        console.error('💥 [Email API] POST endpoint error:', err);
        const { status, message } = handleError(err);
        throw error(status, message);
    }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
    return new Response(null, {
        headers: {
            'Allow': 'POST, OPTIONS'
        }
    });
}
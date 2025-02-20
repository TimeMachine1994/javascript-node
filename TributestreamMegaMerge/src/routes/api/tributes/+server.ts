import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { PaymentBookingFormData } from '$lib/types/checkout';
import type { Tribute, User } from '$lib/types/api';

export const POST: RequestHandler = async ({ request, fetch, locals }) => {
    try {
        // Ensure user is authenticated
        const user = locals.user as User | undefined;
        if (!user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const formData = await request.json() as PaymentBookingFormData;

        // Validate required fields
        if (!formData.personalDetails || !formData.orderDetails || !formData.package) {
            return new Response('Missing required fields', { status: 400 });
        }

        // Prepare data for WordPress
        const tributeData: Omit<Tribute, 'id' | 'content' | 'updated_at'> = {
            title: `Memorial Service for ${formData.package.name}`,
            status: 'pending', // Pending until payment is confirmed
            author: user.id,
            personal_details: {
                firstName: formData.personalDetails.firstName,
                lastName: formData.personalDetails.lastName,
                email: formData.personalDetails.email,
                phone: formData.personalDetails.phone,
                relationship: formData.personalDetails.relationship
            },
            billing_address: formData.billingAddress,
            order_details: {
                pricing: formData.orderDetails.pricing,
                package: {
                    name: formData.package.name,
                    scheduleDays: formData.package.scheduleDays,
                    price: formData.orderDetails.pricing.total
                }
            },
            meta: {
                payment_status: 'pending',
                created_at: new Date().toISOString()
            },
            created_at: new Date().toISOString()
        };

        // Send to WordPress
        const wpResponse = await fetch(`${import.meta.env.VITE_WP_API_URL}/wp/v2/tributes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(tributeData)
        });

        if (!wpResponse.ok) {
            const error = await wpResponse.json();
            throw new Error(error.message || 'Failed to create tribute');
        }

        const tribute = await wpResponse.json() as Tribute;

        // Send confirmation email
        await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: formData.personalDetails.email,
                template: 'memorial-service-confirmation',
                data: {
                    name: `${formData.personalDetails.firstName} ${formData.personalDetails.lastName}`,
                    package: formData.package.name,
                    orderNumber: tribute.id,
                    total: formData.orderDetails.pricing.total,
                    scheduleDays: formData.package.scheduleDays
                }
            })
        });

        return json({
            success: true,
            tribute: {
                id: tribute.id,
                status: tribute.status,
                created_at: tribute.created_at
            }
        });

    } catch (error) {
        console.error('Error creating tribute:', error);
        return new Response(
            error instanceof Error ? error.message : 'Internal server error',
            { status: 500 }
        );
    }
};

// Get all tributes for the current user
export const GET: RequestHandler = async ({ locals, fetch }) => {
    try {
        // Ensure user is authenticated
        const user = locals.user as User | undefined;
        if (!user) {
            return new Response('Unauthorized', { status: 401 });
        }

        // Fetch from WordPress
        const wpResponse = await fetch(
            `${import.meta.env.VITE_WP_API_URL}/wp/v2/tributes?author=${user.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            }
        );

        if (!wpResponse.ok) {
            throw new Error('Failed to fetch tributes');
        }

        const tributes = await wpResponse.json() as Tribute[];

        return json(tributes);

    } catch (error) {
        console.error('Error fetching tributes:', error);
        return new Response(
            error instanceof Error ? error.message : 'Internal server error',
            { status: 500 }
        );
    }
};

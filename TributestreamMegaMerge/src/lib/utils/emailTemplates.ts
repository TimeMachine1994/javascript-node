import type { ScheduleDay } from '$lib/types/api';

interface EmailTemplateData {
    name: string;
    package: string;
    orderNumber: number;
    total: number;
    scheduleDays: ScheduleDay[];
}

interface PaymentConfirmationData {
    name: string;
    orderNumber: number;
    amount: number;
    paymentMethod: string;
    last4?: string;
    transactionId: string;
    date: string;
}

interface ReminderData {
    name: string;
    orderNumber: number;
    nextService: {
        date: string;
        location: {
            name: string;
            address: string;
            startTime: string;
            duration: number;
            notes?: string;
        };
    };
    setupInstructions: string[];
    contactPerson: {
        name: string;
        phone: string;
        email: string;
    };
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeStr: string): string {
    return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

export function getMemorialServiceConfirmationEmail(data: EmailTemplateData): string {
    const scheduleHtml = data.scheduleDays.map(day => `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #1e293b; margin-bottom: 10px;">${formatDate(day.date)}</h3>
            ${day.locations.map(location => `
                <div style="background-color: #f8fafc; padding: 15px; margin-bottom: 10px; border-radius: 6px;">
                    <p style="color: #334155; margin: 0 0 5px 0; font-weight: 500;">${location.name}</p>
                    <p style="color: #64748b; margin: 0 0 5px 0;">${location.address}</p>
                    <p style="color: #64748b; margin: 0;">Start Time: ${location.startTime}</p>
                    <p style="color: #64748b; margin: 0;">Duration: ${location.duration} hours</p>
                    ${location.notes ? `<p style="color: #64748b; margin: 5px 0 0 0;">Notes: ${location.notes}</p>` : ''}
                </div>
            `).join('')}
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Memorial Service Confirmation</title>
        </head>
        <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #1e293b; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <img src="https://tributestream.com/logo.png" alt="TributeStream" style="height: 40px;">
                </div>

                <h1 style="color: #0f172a; margin-bottom: 20px; text-align: center;">Memorial Service Confirmation</h1>
                
                <p style="margin-bottom: 30px; text-align: center;">
                    Thank you for choosing TributeStream for your memorial service.
                </p>

                <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #0f172a; margin-bottom: 20px;">Order Details</h2>
                    
                    <div style="margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
                        <p style="margin: 5px 0;"><strong>Package:</strong> ${data.package}</p>
                        <p style="margin: 5px 0;"><strong>Total Amount:</strong> ${formatCurrency(data.total)}</p>
                    </div>

                    <h2 style="color: #0f172a; margin: 30px 0 20px;">Service Schedule</h2>
                    ${scheduleHtml}
                </div>

                <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="color: #0f172a; margin-bottom: 15px;">What's Next?</h3>
                    <ul style="color: #64748b; margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Our team will review your booking</li>
                        <li style="margin-bottom: 10px;">We'll contact you to confirm all details</li>
                        <li style="margin-bottom: 10px;">You'll receive setup instructions before the service</li>
                    </ul>
                </div>

                <div style="text-align: center; color: #64748b; font-size: 14px;">
                    <p style="margin-bottom: 10px;">
                        Need help? Contact our support team at
                        <a href="mailto:support@tributestream.com" style="color: #4f46e5;">support@tributestream.com</a>
                    </p>
                    <p style="margin: 0;">
                        TributeStream, Inc.<br>
                        1234 Memorial Lane<br>
                        San Francisco, CA 94110
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
}

export function getPaymentConfirmationEmail(data: PaymentConfirmationData): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Confirmation</title>
        </head>
        <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #1e293b; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <img src="https://tributestream.com/logo.png" alt="TributeStream" style="height: 40px;">
                </div>

                <h1 style="color: #0f172a; margin-bottom: 20px; text-align: center;">Payment Confirmation</h1>
                
                <p style="margin-bottom: 30px; text-align: center;">
                    Your payment has been processed successfully.
                </p>

                <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #0f172a; margin-bottom: 20px;">Payment Details</h2>
                    
                    <div style="margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
                        <p style="margin: 5px 0;"><strong>Amount:</strong> ${formatCurrency(data.amount)}</p>
                        <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${data.paymentMethod}${data.last4 ? ` ending in ${data.last4}` : ''}</p>
                        <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${data.transactionId}</p>
                        <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(data.date)}</p>
                    </div>
                </div>

                <div style="text-align: center; color: #64748b; font-size: 14px;">
                    <p style="margin-bottom: 10px;">
                        Need help? Contact our support team at
                        <a href="mailto:support@tributestream.com" style="color: #4f46e5;">support@tributestream.com</a>
                    </p>
                    <p style="margin: 0;">
                        TributeStream, Inc.<br>
                        1234 Memorial Lane<br>
                        San Francisco, CA 94110
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
}

export function getServiceReminderEmail(data: ReminderData): string {
    const setupInstructionsHtml = data.setupInstructions
        .map(instruction => `<li style="margin-bottom: 10px;">${instruction}</li>`)
        .join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Memorial Service Reminder</title>
        </head>
        <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; color: #1e293b; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <img src="https://tributestream.com/logo.png" alt="TributeStream" style="height: 40px;">
                </div>

                <h1 style="color: #0f172a; margin-bottom: 20px; text-align: center;">Your Memorial Service is Tomorrow</h1>
                
                <p style="margin-bottom: 30px; text-align: center;">
                    This is a reminder about your upcoming memorial service.
                </p>

                <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #0f172a; margin-bottom: 20px;">Service Details</h2>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                        <p style="color: #334155; margin: 0 0 5px 0; font-weight: 500;">
                            ${formatDate(data.nextService.date)}
                        </p>
                        <p style="color: #64748b; margin: 0 0 5px 0;">
                            ${data.nextService.location.name}
                        </p>
                        <p style="color: #64748b; margin: 0 0 5px 0;">
                            ${data.nextService.location.address}
                        </p>
                        <p style="color: #64748b; margin: 0;">
                            Start Time: ${formatTime(data.nextService.location.startTime)}
                        </p>
                        <p style="color: #64748b; margin: 0;">
                            Duration: ${data.nextService.location.duration} hours
                        </p>
                        ${data.nextService.location.notes ? 
                            `<p style="color: #64748b; margin: 5px 0 0 0;">Notes: ${data.nextService.location.notes}</p>` 
                            : ''}
                    </div>

                    <h3 style="color: #0f172a; margin: 30px 0 15px;">Setup Instructions</h3>
                    <ul style="color: #64748b; margin: 0 0 20px 0; padding-left: 20px;">
                        ${setupInstructionsHtml}
                    </ul>

                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px;">
                        <h3 style="color: #0f172a; margin: 0 0 15px;">Your Contact Person</h3>
                        <p style="color: #64748b; margin: 0 0 5px 0;">
                            <strong>Name:</strong> ${data.contactPerson.name}
                        </p>
                        <p style="color: #64748b; margin: 0 0 5px 0;">
                            <strong>Phone:</strong> ${data.contactPerson.phone}
                        </p>
                        <p style="color: #64748b; margin: 0;">
                            <strong>Email:</strong> ${data.contactPerson.email}
                        </p>
                    </div>
                </div>

                <div style="text-align: center; color: #64748b; font-size: 14px;">
                    <p style="margin-bottom: 10px;">
                        Need help? Contact our support team at
                        <a href="mailto:support@tributestream.com" style="color: #4f46e5;">support@tributestream.com</a>
                    </p>
                    <p style="margin: 0;">
                        TributeStream, Inc.<br>
                        1234 Memorial Lane<br>
                        San Francisco, CA 94110
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
}
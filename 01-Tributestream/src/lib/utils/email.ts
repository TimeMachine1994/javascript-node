/**
 * Email utilities for handling SendGrid email functionality
 */

import sgMail from '@sendgrid/mail';
import { env } from '$env/dynamic/private';

// Set SendGrid API Key
sgMail.setApiKey(env.SENDGRID_API_KEY || '');

// Email request interface
export interface EmailRequest {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    template?: EmailTemplate;
    templateData?: Record<string, any>;
}

// Email template types
export type EmailTemplate = 
    | 'tribute-confirmation'
    | 'booking-confirmation'
    | 'password-reset'
    | 'welcome-email';

// Email template configurations
interface TemplateConfig {
    subject: string;
    text: (data: any) => string;
    html: (data: any) => string;
}

// Email templates
const templates: Record<EmailTemplate, TemplateConfig> = {
    'tribute-confirmation': {
        subject: 'Your Tribute Has Been Created',
        text: (data) => `
Dear ${data.name},

Your tribute has been successfully created. Thank you for using TributeStream.

Tribute Details:
- Title: ${data.title}
- Date: ${new Date(data.date).toLocaleDateString()}

You can view your tribute at: ${data.url}

Best regards,
The TributeStream Team
        `.trim(),
        html: (data) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Your Tribute Has Been Created</h2>
    <p>Dear ${data.name},</p>
    <p>Your tribute has been successfully created. Thank you for using TributeStream.</p>
    <h3>Tribute Details:</h3>
    <ul>
        <li><strong>Title:</strong> ${data.title}</li>
        <li><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</li>
    </ul>
    <p>You can view your tribute at: <a href="${data.url}">${data.url}</a></p>
    <p>Best regards,<br>The TributeStream Team</p>
</div>
        `.trim()
    },
    'booking-confirmation': {
        subject: 'Your Memorial Service Booking Confirmation',
        text: (data) => `
Dear ${data.name},

Your memorial service booking has been confirmed.

Booking Details:
- Service Type: ${data.package}
- Date: ${new Date(data.date).toLocaleDateString()}
- Time: ${data.time}
- Location: ${data.location}

Total Amount: $${data.amount}

If you need to make any changes, please contact us.

Best regards,
The TributeStream Team
        `.trim(),
        html: (data) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Your Memorial Service Booking Confirmation</h2>
    <p>Dear ${data.name},</p>
    <p>Your memorial service booking has been confirmed.</p>
    <h3>Booking Details:</h3>
    <ul>
        <li><strong>Service Type:</strong> ${data.package}</li>
        <li><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${data.time}</li>
        <li><strong>Location:</strong> ${data.location}</li>
    </ul>
    <p><strong>Total Amount:</strong> $${data.amount}</p>
    <p>If you need to make any changes, please contact us.</p>
    <p>Best regards,<br>The TributeStream Team</p>
</div>
        `.trim()
    },
    'password-reset': {
        subject: 'Password Reset Request',
        text: (data) => `
Dear ${data.name},

We received a request to reset your password. Click the link below to reset your password:

${data.resetUrl}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
The TributeStream Team
        `.trim(),
        html: (data) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Password Reset Request</h2>
    <p>Dear ${data.name},</p>
    <p>We received a request to reset your password. Click the link below to reset your password:</p>
    <p>
        <a href="${data.resetUrl}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        ">Reset Password</a>
    </p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <p>Best regards,<br>The TributeStream Team</p>
</div>
        `.trim()
    },
    'welcome-email': {
        subject: 'Welcome to TributeStream',
        text: (data) => `
Welcome to TributeStream, ${data.name}!

Thank you for joining our community. We're here to help you create meaningful tributes and memorial services.

To get started, visit your dashboard: ${data.dashboardUrl}

If you have any questions, feel free to contact us.

Best regards,
The TributeStream Team
        `.trim(),
        html: (data) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Welcome to TributeStream</h2>
    <p>Welcome to TributeStream, ${data.name}!</p>
    <p>Thank you for joining our community. We're here to help you create meaningful tributes and memorial services.</p>
    <p>
        <a href="${data.dashboardUrl}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        ">Visit Your Dashboard</a>
    </p>
    <p>If you have any questions, feel free to contact us.</p>
    <p>Best regards,<br>The TributeStream Team</p>
</div>
        `.trim()
    }
};

// Validate email request
function validateEmailRequest(request: EmailRequest): { isValid: boolean; message?: string } {
    if (!request.to) {
        return { isValid: false, message: 'Recipient email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.to)) {
        return { isValid: false, message: 'Invalid recipient email format' };
    }

    if (!request.subject) {
        return { isValid: false, message: 'Email subject is required' };
    }

    if (request.template && !templates[request.template]) {
        return { isValid: false, message: 'Invalid email template' };
    }

    if (!request.template && !request.text && !request.html) {
        return { isValid: false, message: 'Email content or template is required' };
    }

    return { isValid: true };
}

// Send email using SendGrid
export async function sendEmail(request: EmailRequest): Promise<void> {
    const validation = validateEmailRequest(request);
    if (!validation.isValid) {
        throw new Error(validation.message);
    }

    let emailContent: { text: string; html: string };
    if (request.template) {
        const template = templates[request.template];
        emailContent = {
            text: template.text(request.templateData || {}),
            html: template.html(request.templateData || {})
        };
    } else {
        emailContent = {
            text: request.text || '',
            html: request.html || ''
        };
    }

    const msg = {
        to: request.to,
        from: 'tributestream@tributestream.com',
        subject: request.subject,
        text: emailContent.text,
        html: emailContent.html
    };

    await sgMail.send(msg);
}
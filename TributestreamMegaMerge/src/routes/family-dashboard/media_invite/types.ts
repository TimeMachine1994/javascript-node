import type { WPUserData } from '$lib/types/user-metadata';

export interface PageData {
    user_id: string;
    token: string;
    userData: WPUserData;
}

export interface Contributor {
    email: string;
    role: 'viewer' | 'editor' | 'contributor';
    status: 'pending' | 'accepted' | 'declined';
}

export interface InviteRequest {
    emails: string[];
    role: Contributor['role'];
    message?: string;
    memorialId: string;
    senderId: string;
}

export interface InviteResponse {
    success: boolean;
    message: string;
    invitations: Array<{
        email: string;
        status: 'sent' | 'failed';
        error?: string;
    }>;
}

export interface InviteError {
    code: string;
    message: string;
    data?: {
        status: number;
        failedEmails?: Array<{
            email: string;
            reason: string;
        }>;
    };
}

export interface ContributorList {
    contributors: Contributor[];
    pagination: {
        total: number;
        currentPage: number;
        totalPages: number;
    };
}
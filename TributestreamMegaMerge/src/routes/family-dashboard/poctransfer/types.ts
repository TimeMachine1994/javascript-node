import type { WPUserData } from '$lib/types/user-metadata';

export interface PageData {
    user_id: string;
    token: string;
    userData: WPUserData;
}

export interface TransferPocRequest {
    newPocEmail: string;
    currentUserId: string;
}

export interface TransferPocResponse {
    success: boolean;
    message: string;
}

export interface TransferPocError {
    code: string;
    message: string;
    data?: {
        status: number;
    };
}
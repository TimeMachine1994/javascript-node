export interface PageData {
    user_id: string;
    token: string;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    files: Array<{
        filename: string;
        url: string;
        id: number;
    }>;
}

export interface UploadError {
    code: string;
    message: string;
    data?: {
        status: number;
    };
}
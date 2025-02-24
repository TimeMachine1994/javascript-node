// Types for the tribute creation form

export interface TributeFormData {
    lovedOneName: string;
    userName: string;
    userEmail: string;
    userPhone: string;
}

export interface TributeFormErrors {
    lovedOneName: string;
    userName: string;
    userEmail: string;
    userPhone: string;
}

export interface RegisterResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
    };
}

export interface TributeResponse {
    id: number;
    loved_one_name: string;
    user_id: number;
    phone_number: string;
    created_at: string;
    updated_at: string;
    custom_html?: string;
    number_of_streams?: number;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface TributeRequest {
    loved_one_name: string;
    phone_number: string;
}

export interface ApiError {
    error: true;
    message: string;
    code?: string;
}
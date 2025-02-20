export interface RegisterData {
    username: string;
    email: string;
    password: string;
    meta?: Record<string, any>;
}

export interface UserRole {
    user_id: number;
    roles: string[];
}

export interface LoginResponse {
    token: string;
    user_email: string;
    user_nicename: string;
    user_display_name: string;
    user_id: number;
    roles: string[];
}

export interface User {
    id: number;
    token: string;
    displayName: string;
    email: string;
    nicename: string;
    roles: string[];
    isAdmin: boolean;
    userMeta: Record<string, any>;
}

export interface MemorialFormData {
    director: {
        firstName: string;
        lastName: string;
    };
    familyMember: {
        firstName: string;
        lastName: string;
        dob: string;
    };
    deceased: {
        firstName: string;
        lastName: string;
        dob: string;
        dop: string;
    };
    contact: {
        email: string;
        phone: string;
    };
    memorial: {
        locationName: string;
        locationAddress: string;
        time: string;
        date: string;
    };
}

export interface ScheduleDay {
    date: string;
    locations: Array<{
        name: string;
        address: string;
        startTime: string;
        duration: number;
        travelExceedsHour: boolean;
        notes?: string;
    }>;
}

export interface PackageDetails {
    name: string;
    scheduleDays: ScheduleDay[];
    price: number;
}

export interface Tribute {
    id: number;
    title: string;
    content: string;
    status: 'draft' | 'published' | 'pending';
    author: number;
    created_at: string;
    updated_at: string;
    personal_details: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        relationship?: string;
    };
    billing_address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    order_details: {
        pricing: {
            items: Array<{
                name: string;
                price: number;
                description?: string;
            }>;
            subtotal: number;
            total: number;
        };
        package: PackageDetails;
    };
    meta: {
        payment_status: 'pending' | 'completed' | 'failed';
        created_at: string;
        [key: string]: any;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
}

export interface UserMeta {
    meta_key: string;
    meta_value: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

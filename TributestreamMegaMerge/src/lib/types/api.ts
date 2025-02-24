export interface Tribute {
    id: number;
    title: string;
    content: string;
    status: string;
    date: string;
    author?: string;
    excerpt?: string;
    featured_image?: string;
    categories?: string[];
    tags?: string[];
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    total_pages: number;
    current_page: number;
    success?: boolean;
    error?: boolean;
    message?: string;
}

export interface TributeSearchResult {
    tributes: Tribute[];
    total: number;
    error?: string;
}

export interface TributeCreateRequest {
    lovedOneName: string;
    point_of_contact_name: string;
    point_of_contact_email: string;
    point_of_contact_phone: string;
}
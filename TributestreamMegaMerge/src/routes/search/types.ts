import type { Tribute } from '$lib/types/api';

export interface SearchPageData {
    tributes: Tribute[];
    totalPages: number;
    totalItems: number;
    currentPage: number;
    searchQuery: string;
    error?: string;
}
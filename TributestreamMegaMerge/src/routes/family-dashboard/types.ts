import type { MemorialFormData, CalculatorData, MetaEntry } from '$lib/types/user-metadata';

// Define the page data structure for family dashboard that matches the server return data
export interface FamilyDashboardData {
    scheduleData: {
        meta?: MetaEntry[];
        // Other potential fields from metaData
        [key: string]: any;
    };
    userMeta?: {
        memorial_form_data?: MemorialFormData;
        // Other user meta fields
        [key: string]: any;
    };
}
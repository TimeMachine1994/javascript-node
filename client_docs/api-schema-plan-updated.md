# API Schema Plan

## Overview
This document outlines the TypeScript interfaces needed to match our WordPress REST API endpoints and SvelteKit frontend implementation.

## Form Data Interfaces

```typescript
// Basic tribute form data
export interface TributeFormData {
    fullName: string;           // Contact's full name
    phoneNumber: string;        // Contact phone
    emailAddress: string;       // Contact email
    lovedOnesName: string;      // Name of the deceased
    Slug: string;              // Custom URL slug
}

// Funeral director form data
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

// Calculator data structure
export interface CalculatorData {
    scheduleDays: Array<{
        date: string;
        locations: Array<{
            name: string;
            address: string;
            startTime: string;
            duration: number;
            travelExceedsHour: boolean;
            notes: string;
        }>;
    }>;
    cartItems: Array<{
        name: string;
        price: number;
    }>;
    cartTotal: number;
    selectedPackage: string;
    personalDetails: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
}
```

## API Request/Response Interfaces

### 1. Authentication & Registration

```typescript
// Registration data (used by both simple and FD forms)
export interface RegisterData {
    username: string;
    email: string;
    password: string;
    meta?: Record<string, string>;
}

// Registration response
export interface RegistrationResponse {
    user_id: number;
    success: boolean;
    message?: string;
    error?: boolean;
    code?: string;
}

// Authentication request
export interface AuthRequest {
    username: string;
    password: string;
}

// Authentication response (JWT)
export interface AuthResponse {
    token: string;
    user_display_name: string;
    user_email: string;
    user_nicename: string;
    roles?: string[];
}

// User data stored in cookie
export interface UserCookieData {
    displayName: string;
    email: string;
    nicename: string;
    roles: string[];
    isAdmin: boolean;
    metaResult?: any;
}
```

### 2. Tribute Interfaces

```typescript
// Base Tribute interface (wp_tributes table)
export interface Tribute {
    id: number;
    user_id: number;
    loved_one_name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    custom_html?: string;
    phone_number: string;
    number_of_streams?: number;
}

// Tribute creation request (matches WordPress API)
export interface TributeCreateRequest {
    user_id: number;
    loved_one_name: string;
    point_of_contact_name: string;
    point_of_contact_email: string;
    point_of_contact_phone: string;
    slug: string;
    custom_html?: string;
    number_of_streams?: number;
}

// Tribute update request
export interface TributeUpdateRequest {
    loved_one_name?: string;
    point_of_contact_name?: string;
    point_of_contact_email?: string;
    point_of_contact_phone?: string;
    slug?: string;
    custom_html?: string;
    number_of_streams?: number;
}

// Paginated tribute response
export interface PaginatedTributeResponse {
    tributes: Tribute[];
    total_pages: number;
    total_items: number;
    current_page: number;
}
```

### 3. Form Action Responses

```typescript
// Generic form action response
export interface FormActionResponse {
    success: boolean;
    message: string;
    tribute?: Tribute;
    error?: boolean;
    emailError?: string;
    code?: string;
}

// Generic API response wrapper
export interface ApiSuccess<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    error: true;
    message: string;
    status: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

## Implementation Examples

### 1. Simple Tribute Creation

```typescript
// In +page.server.ts
export const actions: Actions = {
    create: async ({ request, cookies, fetch }: RequestEvent): Promise<FormActionResponse> => {
        const formData = await request.formData();
        const data: TributeFormData = {
            fullName: formData.get('fullName') as string,
            phoneNumber: formData.get('phoneNumber') as string,
            emailAddress: formData.get('emailAddress') as string,
            lovedOnesName: formData.get('lovedOnesName') as string,
            Slug: formData.get('Slug') as string
        };

        try {
            // Transform to API request format
            const tributeRequest: TributeCreateRequest = {
                loved_one_name: data.lovedOnesName,
                point_of_contact_name: data.fullName,
                point_of_contact_email: data.emailAddress,
                point_of_contact_phone: data.phoneNumber,
                slug: data.Slug,
                user_id: userId // from registration
            };

            const response = await fetch('/api/tributes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(tributeRequest)
            });

            const result = await response.json();
            
            return {
                success: true,
                message: 'Memorial created successfully',
                tribute: result
            };
        } catch (error) {
            return {
                success: false,
                error: true,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            };
        }
    }
};
```

### 2. Funeral Director Form

```typescript
// In fd-form/+page.server.ts
export const actions: Actions = {
    default: async ({ request, cookies, fetch }: RequestEvent): Promise<FormActionResponse> => {
        const formData = await request.formData();
        const data: MemorialFormData = {
            director: {
                firstName: formData.get('director-first-name') as string,
                lastName: formData.get('director-last-name') as string
            },
            // ... rest of form data
        };

        // Transform to API request format
        const tributeRequest: TributeCreateRequest = {
            loved_one_name: `${data.deceased.firstName} ${data.deceased.lastName}`,
            point_of_contact_name: `${data.familyMember.firstName} ${data.familyMember.lastName}`,
            point_of_contact_email: data.contact.email,
            point_of_contact_phone: data.contact.phone,
            slug: generateSlug(data.deceased.firstName, data.deceased.lastName),
            user_id: userId // from registration
        };

        // Create tribute and handle response...
    }
};
```

## Usage Notes

1. Form Data Transformation:
   - Transform frontend form data to match API request format
   - Validate all required fields
   - Handle both simple and complex form submissions

2. Error Handling:
   - Use type-safe error responses
   - Provide user-friendly error messages
   - Handle both API and form validation errors

3. Authentication Flow:
   - Register user first
   - Authenticate to get JWT token
   - Use token for protected operations

## Next Steps

1. Update `src/lib/types/api.ts` with these interfaces
2. Update form components to use correct types
3. Implement form validation
4. Update API endpoints to match types
5. Add comprehensive error handling
# API Schema Plan

## Overview
This document outlines the TypeScript interfaces needed to match our WordPress REST API endpoints under the 'tributestream/v1' namespace.

## Current Status
We currently have basic Tribute and pagination interfaces that need to be updated to match our actual WordPress implementation.

## Required Interface Updates

### 1. Tribute Interfaces

```typescript
// Base Tribute interface matching wp_tributes table
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

// Tribute creation request
export interface TributeCreateRequest {
    user_id: number;
    loved_one_name: string;
    slug: string;
    custom_html?: string;
    phone_number: string;
    number_of_streams?: number;
}

// Tribute update request
export interface TributeUpdateRequest {
    loved_one_name?: string;
    slug?: string;
    custom_html?: string;
    phone_number?: string;
    number_of_streams?: number;
}
```

### 2. Authentication Interfaces

```typescript
// JWT Authentication response
export interface JwtAuthResponse {
    token: string;
    user_display_name: string;
    user_email: string;
    user_nicename: string;
}

// Registration request
export interface RegistrationRequest {
    username: string;
    email: string;
    password: string;
    meta?: Record<string, string>;
}

// Registration response
export interface RegistrationResponse {
    user_id: number;
}
```

### 3. User Meta Interfaces

```typescript
// User meta update request
export interface UserMetaRequest {
    user_id: number;
    meta_key: string;
    meta_value: string;
}

// User meta response
export interface UserMetaResponse {
    success: boolean;
    user_id: number;
    meta: Array<{
        meta_key: string;
        meta_value: string;
    }>;
}
```

### 4. Role Interfaces

```typescript
// Get role response
export interface UserRoleResponse {
    user_id: number;
    roles: string[];
}
```

### 5. API Response Interfaces

```typescript
// Generic API response
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

// Error response
export interface ApiError {
    code: string;
    message: string;
    data: {
        status: number;
    };
}

// Updated pagination interface
export interface PaginatedResponse<T> {
    tributes: T[];
    total_pages: number;
    total_items: number;
    current_page: number;
}
```

## Implementation Plan

1. Update `src/lib/types/api.ts` with new interfaces
2. Update any existing components using the old interfaces
3. Add JSDoc comments to document each interface
4. Create type guards where necessary for runtime type checking
5. Update API client functions to use new types

## Next Steps

1. Review this schema plan
2. Implement the new types
3. Update existing code to use new interfaces
4. Add validation using type guards
5. Update documentation

## Notes

- All interfaces should be exported for use across the application
- Consider adding Zod schemas for runtime validation
- Keep interfaces in sync with WordPress plugin schema
- Consider adding OpenAPI/Swagger documentation
# Authentication Architecture Analysis
Last Updated: February 18, 2025

## Overview

This document details the authentication architecture implemented in our SvelteKit 5 application, specifically focusing on the integration with WordPress and JWT authentication.

## 1. Authentication Flow

### Login Process
1. User submits credentials to `/login` route
2. Server validates form data (username/password)
3. Server proxies request to WordPress JWT endpoint (`/wp-json/jwt-auth/v1/token`)
4. Upon success:
   - Receives JWT token and basic user information
   - Makes secondary request to custom endpoint (`/wp-json/tributestream/v1/user-cap`) to fetch roles and capabilities
   - Makes tertiary request to user meta endpoint (`/api/user-meta?user_id={user_id}`) to fetch user meta data
   - Sets consolidated cookie structure with all user data
   - Redirects user based on role (admin/editor/default dashboard)

### Cookie Management
We use a consolidated two-cookie approach:

1. **JWT Cookie**
```typescript
// HTTP-only JWT cookie
jwt = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
}
```

2. **User Data Cookie**
```typescript
// Client-accessible user data
user = {
    displayName: string,
    email: string,
    nicename: string,
    roles: string[],
    isAdmin: boolean,
    userMeta: Record<string, any>, // User meta data from WordPress
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24
}
```

## 2. Server-Side Implementation

### API Proxy Structure
All WordPress interactions are proxied through SvelteKit server endpoints:

1. **Authentication Endpoint** (`/api/auth`):
   - Handles initial authentication
   - Proxies requests to WordPress JWT endpoint
   - Fetches additional user data and roles
   - Returns combined response with:
     * JWT token
     * User display name
     * User email
     * User nicename
     * User ID
     * Roles array
     * Capabilities object

2. **Role Management** (`/api/getRole`):
   - Fetches user roles using user ID
   - Integrates with custom WordPress plugin
   - Returns role information and capabilities

3. **User Metadata** (`/api/user-meta`):
    - Handles user metadata operations
    - Supports GET and POST operations
    - GET: Fetches all meta data for a user
      ```typescript
      // GET /api/user-meta?user_id={id}
      // Response:
      {
          meta_data: Record<string, any>
      }
      ```
    - POST: Updates user meta data
      ```typescript
      // POST /api/user-meta
      // Request:
      {
          user_id: string,
          meta_key: string,
          meta_value: any
      }
      ```
    - Requires JWT authentication
    - Proxies requests to WordPress user meta endpoints
    - Used during login flow to fetch user preferences and settings

### Server Hooks Implementation
Located in `hooks.server.ts`, our server hooks provide:

1. **Request Interception**:
   - Reads and validates JWT cookie
   - Parses user data cookie
   - Attaches data to `event.locals`

2. **Route Protection**:
   - Automatically redirects `/admin` to `/admin-dashboard`
   - Validates JWT presence for protected routes
   - Checks role-based access (admin/editor)
   - Implements redirect logic for unauthorized access

3. **Data Access**:
   ```typescript
   // Available in event.locals
   {
       jwt: string,          // Raw JWT token
       user: {
           displayName: string,
           email: string,
           nicename: string,
           roles: string[],
           isAdmin: boolean,
           userMeta: Record<string, any> // User meta data from WordPress
       }
   }
   ```

## 3. WordPress Integration

### Custom Plugin Integration
Our WordPress backend includes custom endpoints:

1. **User Capabilities Endpoint**:
   - Path: `/wp-json/tributestream/v1/user-cap`
   - Method: GET
   - Authentication: Bearer token
   - Returns:
     ```typescript
     {
         user_id: number,
         roles: string[],
         capabilities: Record<string, boolean>
     }
     ```

2. **JWT Authentication**:
   - Path: `/wp-json/jwt-auth/v1/token`
   - Method: POST
   - Payload: `{ username: string, password: string }`
   - Returns:
     ```typescript
     {
         token: string,
         user_display_name: string,
         user_email: string,
         user_nicename: string
     }
     ```

### Role-Based Access Control
We implement multiple user roles with specific capabilities:

1. **Administrator**:
   - Full access to admin dashboard
   - Access to all administrative functions
   - Redirected to `/admin-dashboard`

2. **Editor**:
   - Access to content management
   - Limited administrative capabilities
   - Redirected to `/editor-dashboard`

3. **Default User**:
   - Basic user privileges
   - Redirected to `/dashboard`

## 4. Security Measures

### Token Security
1. **JWT Storage**:
   - Stored in HTTP-only cookie
   - Secure flag enabled
   - Strict same-site policy
   - 24-hour expiration

2. **User Data Protection**:
   - Sensitive data in HTTP-only cookies
   - Non-sensitive data in client-accessible cookie
   - Role-based information properly segregated

### Request Security
1. **API Protection**:
   - All WordPress requests proxied through server
   - No direct client-to-WordPress communication
   - Request validation and sanitization

2. **Route Protection**:
   - Server-side role verification
   - Protected admin routes
   - Automatic unauthorized redirects

## 5. Error Handling

### Authentication Errors
1. **Login Failures**:
   - Invalid credentials handling
   - Missing field validation
   - Rate limiting (WordPress level)

2. **Token Errors**:
   - Invalid token detection
   - Expired token handling
   - Malformed token handling

### Role Verification Errors
1. **Missing Roles**:
   - Defaults to empty array
   - Logs error for monitoring
   - Maintains user session

2. **Invalid Permissions**:
   - Redirects to appropriate dashboard
   - Logs unauthorized access attempts
   - Provides user feedback

## 6. Client-Side Integration

### SvelteKit Components
1. **Login Form**:
   - Form validation
   - Error message display
   - Loading state management

2. **Protected Routes**:
   - Role-based component rendering
   - Automatic redirects
   - Loading states

### State Management
1. **Authentication State**:
   - Reactive user session management
   - Role-based UI updates
   - Error state handling

2. **Route Guards**:
   - Client-side role checking
   - Protected component mounting
   - Unauthorized access prevention

## 7. Development Considerations

### Local Development
1. **Environment Setup**:
   - WordPress development instance
   - JWT secret configuration
   - CORS settings

2. **Testing**:
   - Authentication flow testing
   - Role-based access testing
   - Error scenario testing

### Deployment
1. **Production Settings**:
   - Secure cookie configuration
   - WordPress endpoint configuration
   - Error logging setup

2. **Monitoring**:
   - Authentication failure monitoring
   - Role verification logging
   - Performance metrics

## 8. Future Improvements

1. **Token Refresh**:
   - Implement refresh token mechanism
   - Handle token expiration gracefully
   - Maintain session continuity

2. **Enhanced Security**:
   - Implement rate limiting
   - Add brute force protection
   - Enhance audit logging

3. **User Experience**:
   - Real-time role updates
   - Enhanced error messaging
   - Improved loading states

## Conclusion

Our authentication architecture provides a secure, maintainable, and scalable solution for WordPress integration with our SvelteKit application. The implementation balances security requirements with user experience, while maintaining clear separation of concerns and following best practices for modern web applications.
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

### Pseudo-code Flow
```
// 1. User submits login form
submitLoginForm(username, password) {
    // 2. Validate credentials with WordPress
    response = POST "/wp-json/jwt-auth/v1/token" {
        username: username,
        password: password
    }
    
    if (response.ok) {
        jwt = response.token
        user_id = response.user_id
        
        // 3. Fetch user roles
        roles = GET "/wp-json/tributestream/v1/user-cap" {
            headers: { Authorization: `Bearer ${jwt}` }
        }
        
        // 4. Fetch user meta data
        meta = GET "/api/user-meta?user_id={user_id}" {
            headers: { Authorization: `Bearer ${jwt}` }
        }
        
        // 5. Set cookies
        setCookie("jwt", jwt, { httpOnly: true, secure: true })
        setCookie("user", {
            displayName: response.user_display_name,
            email: response.user_email,
            roles: roles,
            userMeta: meta,
            isAdmin: roles.includes("administrator")
        })
        
        // 6. Redirect based on role
        if (isAdmin) redirect("/admin-dashboard")
        else if (isEditor) redirect("/editor-dashboard")
        else redirect("/dashboard")
    }
}
```

## 2. Cookie Structure

### JWT Cookie (HTTP-only)
```
{
    name: "jwt",
    value: "encoded.jwt.token",
    options: {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 24 hours
    }
}
```

### User Cookie (Client-accessible)
```
{
    name: "user",
    value: {
        displayName: string,
        email: string,
        nicename: string,
        roles: string[],
        isAdmin: boolean,
        userMeta: {
            // User preferences and settings
            theme: string,
            notifications: boolean,
            // Any other meta data from WordPress
            [key: string]: any
        }
    },
    options: {
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 24 hours
    }
}
```

## 3. Server-Side Implementation

### Request Handling Flow
```
// Server Hook (runs on every request)
handleRequest(event) {
    // 1. Extract cookies
    jwt = getCookie("jwt")
    userData = parseCookie("user")
    
    // 2. Attach to event.locals
    event.locals = {
        jwt: jwt,
        user: {
            ...userData,
            isAdmin: userData?.roles?.includes("administrator")
        }
    }
    
    // 3. Route Protection
    if (isAdminRoute(event.url)) {
        if (!jwt) redirect("/login")
        if (!event.locals.user.isAdmin) redirect("/dashboard")
    }
    
    return handleRequest(event)
}
```

### API Endpoints

#### 1. Authentication (`/api/auth`)
```
POST /api/auth
Request:
{
    username: string,
    password: string
}

Response:
{
    token: string,
    user_display_name: string,
    user_email: string,
    user_nicename: string,
    user_id: string
}
```

#### 2. Role Management (`/api/getRole`)
```
GET /api/getRole?id={user_id}
Headers:
    Authorization: Bearer {jwt}

Response:
{
    roles: string[],
    capabilities: {
        [capability: string]: boolean
    }
}
```

#### 3. User Meta (`/api/user-meta`)
```
GET /api/user-meta?user_id={id}
Headers:
    Authorization: Bearer {jwt}

Response:
{
    meta_data: {
        [key: string]: any
    }
}

POST /api/user-meta
Headers:
    Authorization: Bearer {jwt}
Request:
{
    user_id: string,
    meta_key: string,
    meta_value: any
}
```

## 4. WordPress Integration

### Custom Plugin Endpoints

#### User Capabilities
```
GET /wp-json/tributestream/v1/user-cap
Headers:
    Authorization: Bearer {jwt}

Response:
{
    user_id: number,
    roles: string[],
    capabilities: {
        [capability: string]: boolean
    }
}
```

#### JWT Authentication
```
POST /wp-json/jwt-auth/v1/token
Request:
{
    username: string,
    password: string
}

Response:
{
    token: string,
    user_display_name: string,
    user_email: string,
    user_nicename: string
}
```

## 5. Error Handling

### Authentication Errors
```
handleAuthError(error) {
    if (error.type === "invalid_credentials") {
        return { status: 401, message: "Invalid username or password" }
    }
    if (error.type === "token_expired") {
        clearAuthCookies()
        redirect("/login")
    }
    if (error.type === "meta_fetch_failed") {
        // Continue with empty meta data
        return { userMeta: {} }
    }
}
```

### Role Verification
```
verifyUserRole(user, requiredRole) {
    if (!user.roles) return false
    if (requiredRole === "admin" && !user.isAdmin) {
        redirect("/dashboard")
        return false
    }
    return user.roles.includes(requiredRole)
}
```

## 6. Security Measures

### Token Management
- JWT stored in HTTP-only cookie
- User data in separate, client-accessible cookie
- Secure and SameSite flags enabled
- 24-hour token expiration
- All API requests require valid JWT
- Meta data requests require JWT authentication

### Route Protection
- Server-side role verification
- Client-side route guards
- Automatic redirects for unauthorized access
- Protected admin routes
- Role-based access control

## 7. Data Flow

```
Login Flow:
User -> Login Form -> WordPress JWT -> User Capabilities -> User Meta -> Cookies -> Redirect

Request Flow:
Request -> Cookie Check -> Role Verification -> Route Protection -> Response

Meta Data Flow:
Request -> JWT Check -> WordPress API -> Meta Data -> User Cookie
```

## 8. Future Improvements

1. Token Refresh Mechanism
```
handleTokenRefresh() {
    if (tokenNearingExpiration) {
        newToken = refreshToken(currentToken)
        updateCookies(newToken)
    }
}
```

2. Real-time Role Updates
```
subscribeToRoleUpdates(userId) {
    onRoleChange(userId, (newRoles) => {
        updateUserCookie(newRoles)
        refreshUI()
    })
}
```

3. Enhanced Security
```
implementRateLimiting() {
    trackLoginAttempts()
    enforceMaxAttempts()
    implementCooldown()
}
```

## Conclusion

This authentication architecture provides a secure, maintainable, and scalable solution for WordPress integration with our SvelteKit application. The implementation balances security requirements with user experience while maintaining clear separation of concerns and following best practices for modern web applications.
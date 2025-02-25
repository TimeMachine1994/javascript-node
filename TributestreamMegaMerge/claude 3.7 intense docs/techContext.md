# Technical Context

*Last updated: February 25, 2025*

## Core Technologies Used

### Frontend

1. **SvelteKit 5**
   - Full-stack framework for building web applications
   - File-based routing system
   - Server-side rendering (SSR) and static site generation (SSG)
   - Form actions for server-side form processing
   - API routes for backend functionality

2. **Svelte 5**
   - Component-based UI framework
   - Reactive state management using runes:
     - `$state` for reactive variables
     - `$derived` for computed values
     - `$effect` for side effects
     - `$props` for component props
   - Minimal runtime with compile-time optimizations
   - Snippets for component composition

3. **TypeScript**
   - Static type checking
   - Interface-based type definitions
   - Enhanced IDE support and code completion
   - Improved code quality and maintainability

4. **Tailwind CSS**
   - Utility-first CSS framework
   - Responsive design utilities
   - Component styling with consistent design tokens
   - JIT (Just-In-Time) compiler for optimized CSS output

5. **Shadcn UI**
   - Component library built on Tailwind CSS
   - Accessible UI components
   - Consistent design language
   - Customizable through Tailwind configuration

### Backend

1. **WordPress**
   - Content management system
   - Custom post types for tributes
   - User management and authentication
   - REST API for headless CMS functionality

2. **JWT Authentication**
   - Token-based authentication
   - Secure communication between frontend and backend
   - Stateless authentication mechanism

3. **MySQL**
   - Relational database for WordPress
   - Storage for user data, content, and metadata
   - Efficient querying for content retrieval

### Development Tools

1. **Vite**
   - Fast development server
   - Hot module replacement (HMR)
   - Optimized production builds
   - Plugin ecosystem for extensions

2. **npm/Node.js**
   - Package management
   - Build scripts and automation
   - Server-side JavaScript execution

3. **Prettier**
   - Code formatting
   - Consistent code style
   - Integration with editor workflows

## Integration Patterns

### WordPress REST API Integration

The frontend communicates with WordPress through its REST API:

```
SvelteKit Frontend ←→ WordPress REST API ←→ WordPress Database
```

Key integration points:

1. **Authentication**
   - JWT token acquisition through `/wp-json/jwt-auth/v1/token`
   - Token validation through `/wp-json/jwt-auth/v1/token/validate`
   - Token storage in HTTP-only cookies

2. **User Data**
   - User metadata retrieval through custom endpoints
   - Role and capability management
   - Profile information management

3. **Tribute Content**
   - Creation and retrieval of tribute posts
   - Media management for tributes
   - Search and filtering capabilities

### Email Integration

SendGrid is used for transactional emails:

```
SvelteKit API Routes ←→ SendGrid API ←→ Email Delivery
```

Email templates are defined in `src/lib/utils/emailTemplates.ts` and sent through the `/api/send-email` endpoint.

## Technical Constraints

1. **WordPress Compatibility**
   - Must maintain compatibility with WordPress REST API
   - Custom plugin dependencies must be kept up to date
   - JWT authentication plugin requirements

2. **Browser Support**
   - Modern browsers (Chrome, Firefox, Safari, Edge)
   - Limited support for older browsers
   - Progressive enhancement for core functionality

3. **Performance Requirements**
   - Initial page load under 2 seconds
   - Time to interactive under 3 seconds
   - Optimized bundle sizes for mobile devices

4. **Security Considerations**
   - JWT token storage in HTTP-only cookies
   - CSRF protection for form submissions
   - Input validation on both client and server
   - Content security policy implementation

## Development Environment

1. **Local Development**
   - Vite development server (`npm run dev`)
   - Local WordPress instance
   - Environment variables for configuration

2. **Testing**
   - Manual testing procedures
   - Browser compatibility testing
   - Responsive design testing

3. **Deployment**
   - SvelteKit adapter-auto for deployment flexibility
   - WordPress hosting requirements
   - Database backup and migration procedures
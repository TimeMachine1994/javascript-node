# System Patterns

*Last updated: February 25, 2025*

## High-level Architecture

Tributestream is built using a modern web architecture that combines a SvelteKit 5 frontend with a WordPress backend. This headless CMS approach allows us to leverage WordPress's content management capabilities while providing a fast, responsive user interface with SvelteKit.

### Core Technical Patterns

1. **Headless CMS Architecture**
   - WordPress serves as the backend content repository and authentication system
   - SvelteKit frontend consumes WordPress data via REST APIs
   - JWT authentication for secure communication between frontend and backend

2. **Component-Based UI Development**
   - Modular Svelte components for reusability and maintainability
   - Tailwind CSS for utility-first styling
   - Shadcn UI components for consistent design language

3. **State Management**
   - Svelte 5 runes (`$state`, `$derived`, `$effect`) for reactive state
   - Singleton state classes for global state management
   - Server-side state hydration for initial page loads

4. **Server-Side Rendering (SSR)**
   - SvelteKit's hybrid rendering approach
   - SSR for initial page loads and SEO optimization
   - Client-side navigation for subsequent page transitions

### Data Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  User Input  │─────▶│  SvelteKit  │─────▶│  WordPress  │
│              │      │  Frontend   │      │  Backend    │
└─────────────┘      └──────┬──────┘      └──────┬──────┘
                            │                     │
                            ▼                     ▼
                     ┌─────────────┐      ┌─────────────┐
                     │  Component  │      │   MySQL     │
                     │    State    │      │  Database   │
                     └─────────────┘      └─────────────┘
```

1. **Authentication Flow**
   - User credentials sent to WordPress JWT Auth endpoint
   - JWT token returned and stored in HTTP-only cookie
   - Token included in subsequent API requests

2. **Data Fetching Pattern**
   - SvelteKit load functions for server-side data fetching
   - API endpoints for client-side data fetching
   - WordPress REST API for content retrieval

3. **Form Submission Pattern**
   - SvelteKit form actions for server-side form processing
   - Client-side validation with reactive state
   - Server-side validation before WordPress API calls

### Key Technical Decisions

1. **SvelteKit 5 Selection**
   - Minimal runtime overhead compared to React/Vue
   - Built-in routing and server-side rendering
   - Svelte 5 runes for improved reactivity model

2. **WordPress as Backend**
   - Robust content management capabilities
   - Extensible plugin ecosystem
   - Familiar admin interface for content editors

3. **JWT Authentication**
   - Stateless authentication mechanism
   - Secure token storage in HTTP-only cookies
   - Reduced backend load compared to session-based auth

4. **Tailwind CSS**
   - Utility-first approach for rapid development
   - Consistent design system implementation
   - Small production bundle size with purging

5. **TypeScript Integration**
   - Type safety across the application
   - Improved developer experience and code quality
   - Better IDE support and documentation
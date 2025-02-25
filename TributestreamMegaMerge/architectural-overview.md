# Tributestream Architectural Overview

## Executive Summary

Tributestream is a SvelteKit 5 web application designed to provide memorial livestreaming services. The platform allows users to create, manage, and share memorial tributes for loved ones, with features including customizable memorial pages, livestreaming capabilities, and family dashboards for managing memorial events. The application uses a modern frontend architecture with a WordPress backend for content management and user authentication.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Browser                              │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SvelteKit Frontend                         │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐    │
│  │    Routes    │   │    State    │   │     Components      │    │
│  │  (SSR/CSR)   │◄──┤  Management │◄──┤                     │    │
│  │              │   │             │   │                     │    │
│  └─────────────┘   └─────────────┘   └─────────────────────┘    │
│         │                 ▲                     ▲                │
│         │                 │                     │                │
│         ▼                 │                     │                │
│  ┌─────────────┐          │                     │                │
│  │   API       │          │                     │                │
│  │  Endpoints  │          │                     │                │
│  │             │          │                     │                │
│  └──────┬──────┘          │                     │                │
│         │                 │                     │                │
└─────────┼─────────────────┼─────────────────────┼────────────────┘
          │                 │                     │
          ▼                 │                     │
┌─────────────────────────────────────────────────────────────────┐
│                      WordPress Backend                           │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐    │
│  │  JWT Auth   │   │  Custom API  │   │   Content Storage   │    │
│  │  Endpoints  │   │  Endpoints   │   │                     │    │
│  │             │   │              │   │                     │    │
│  └─────────────┘   └─────────────┘   └─────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Core Modules and Responsibilities

### 1. Frontend (SvelteKit 5)

#### 1.1 Routes Module
- **Responsibility**: Handles URL routing and page rendering
- **Key Components**:
  - Page routes (`+page.svelte` files)
  - Layout components (`+layout.svelte` files)
  - Server-side route handlers (`+page.server.ts` files)
  - API endpoints (`+server.ts` files)
- **Implementation**: Uses SvelteKit's file-based routing system with both server-side rendering (SSR) and client-side rendering (CSR) capabilities

#### 1.2 Components Module
- **Responsibility**: Provides reusable UI elements and page sections
- **Key Components**:
  - Layout components (Header, Footer, HomePage)
  - UI components (Button, Card, Input, Label)
  - Feature-specific components (MemorialDetailsPanel, PricingPanel, UserInfoPanel)
- **Implementation**: Uses Svelte 5's component system with runes for reactivity

#### 1.3 State Management Module
- **Responsibility**: Manages application state and data flow
- **Key Components**:
  - User state (`user.state.ts`)
  - Tribute search state (`tribute-search.state.ts`)
- **Implementation**: Uses Svelte 5's runes (`$state`, `$derived`, `$effect`) for reactive state management

#### 1.4 API Integration Module
- **Responsibility**: Communicates with the WordPress backend
- **Key Components**:
  - Authentication API (`/api/auth/+server.ts`)
  - User metadata API (`/api/user-meta/+server.js`)
  - Tributes API (`/api/tributes/+server.ts`)
- **Implementation**: Uses fetch API for HTTP requests with JWT authentication

### 2. Backend (WordPress)

#### 2.1 Authentication Module
- **Responsibility**: Handles user authentication and authorization
- **Key Components**:
  - JWT Auth plugin
  - Custom user roles and capabilities
- **Implementation**: Uses WordPress JWT Auth plugin for token-based authentication

#### 2.2 Content Management Module
- **Responsibility**: Manages tribute content and metadata
- **Key Components**:
  - Custom post types for tributes
  - User metadata storage
- **Implementation**: Uses WordPress custom post types and user meta tables

#### 2.3 API Module
- **Responsibility**: Exposes REST API endpoints for frontend consumption
- **Key Components**:
  - JWT authentication endpoints
  - Custom tribute endpoints
  - User metadata endpoints
- **Implementation**: Uses WordPress REST API with custom endpoints

## Data Flow and Persistence

### Authentication Flow
1. User submits credentials on login page
2. SvelteKit server sends credentials to WordPress JWT Auth endpoint
3. WordPress validates credentials and returns JWT token
4. SvelteKit stores token in HTTP-only cookie for security
5. User data is stored in a separate cookie for client-side access
6. Subsequent API requests include JWT token in Authorization header

### Tribute Creation Flow
1. User enters loved one's name and contact information on homepage
2. Data is submitted to SvelteKit server endpoint
3. Server validates data and sends to WordPress API
4. WordPress creates tribute post and returns confirmation
5. User is redirected to tribute page or dashboard

### Data Persistence
- **User Authentication**: JWT tokens stored in HTTP-only cookies
- **User Preferences**: Stored in WordPress user meta tables
- **Tribute Content**: Stored as WordPress custom post types
- **Memorial Details**: Stored as post meta or user meta in WordPress
- **Client-side State**: Managed using Svelte 5's reactive state system

## Technologies and Frameworks

### Frontend
- **SvelteKit 5**: Full-stack framework for building web applications
- **Svelte 5**: Component framework with reactive state management
- **TypeScript**: For type safety and improved developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Component library for consistent UI elements
- **Vite**: Build tool and development server

### Backend
- **WordPress**: Content management system and backend API
- **JWT Auth**: Authentication plugin for secure token-based auth
- **Custom WordPress Plugin**: For extended functionality and API endpoints
- **MySQL**: Database for WordPress content and user data

## Scalability, Performance, and Security Considerations

### Scalability
- **Server-side Rendering (SSR)**: Improves initial load performance and SEO
- **Static Site Generation (SSG)**: Can be used for static content to reduce server load
- **Adapter-auto**: SvelteKit adapter for automatic deployment configuration
- **WordPress Scaling**: Can be scaled horizontally with proper caching strategies

### Performance
- **Code Splitting**: Automatic code splitting for optimized bundle sizes
- **Lazy Loading**: Dynamic imports for component-level code splitting
- **Svelte 5 Optimizations**: Minimal runtime and efficient updates
- **Tailwind CSS**: Purges unused CSS for smaller stylesheets
- **Caching Strategies**: Can be implemented for API responses and static assets

### Security
- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents client-side access to authentication tokens
- **Content Security Policy**: Can be implemented to prevent XSS attacks
- **Input Validation**: Client and server-side validation for user inputs
- **WordPress Security**: Regular updates and security best practices

## Design Patterns and Architectural Styles

### Architectural Styles
- **Component-Based Architecture**: Modular UI components for reusability
- **JAMstack**: JavaScript, APIs, and Markup for modern web development
- **Headless CMS**: WordPress as a headless CMS with custom frontend
- **Progressive Enhancement**: Core functionality works without JavaScript

### Design Patterns
- **Singleton Pattern**: Used for state management classes
- **Observer Pattern**: Implemented through Svelte's reactive system
- **Repository Pattern**: Abstraction for data access in API modules
- **Factory Pattern**: Used for creating default objects and configurations
- **Adapter Pattern**: Used for integrating with WordPress API

## Key Features

### Memorial Tributes
- Creation and customization of memorial pages
- Custom URLs for sharing (e.g., `celebration-of-life-for-[name]`)
- Media upload and management

### Livestreaming
- Scheduling of livestream events
- Viewing of livestreams through custom memorial pages
- Recording and archiving of past livestreams

### Family Dashboard
- Management of memorial details
- Payment processing and package selection
- Media upload and management
- Invitation system for sharing with family and friends

### Search Functionality
- Searching for existing tributes
- Filtering and sorting of search results

## Future Considerations

### Technical Enhancements
- **Internationalization**: Support for multiple languages using Paraglide.js
- **Progressive Web App (PWA)**: Offline capabilities and mobile installation
- **Real-time Features**: WebSocket integration for live updates
- **Analytics Integration**: User behavior tracking and reporting

### Business Capabilities
- **Subscription Models**: Recurring revenue for extended services
- **Additional Media Types**: Support for more media formats and integrations
- **Enhanced Customization**: More options for personalizing memorial pages
- **Integration with Funeral Homes**: API for funeral home management systems

## Conclusion

The Tributestream application leverages modern web technologies to provide a robust platform for memorial livestreaming services. The architecture balances performance, security, and scalability while providing a seamless user experience. The combination of SvelteKit 5 for the frontend and WordPress for the backend offers a powerful and flexible solution that can evolve to meet future requirements.
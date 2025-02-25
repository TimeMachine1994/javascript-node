# TributeStream Architecture Documentation

## 1. Introduction

### Purpose
This documentation provides a comprehensive overview of the Tributestream platform's architecture, designed to serve as a reference for developers, maintainers, and stakeholders. It covers the current MVP implementation and establishes a foundation for future development.

### Scope
- Frontend architecture (SvelteKit 5)
- Backend integration (WordPress REST API)
- Authentication system
- Media handling
- Deployment infrastructure
- Email system
- Memorial service scheduling and pricing

### Tech Stack Summary
- **Frontend**: SvelteKit 5, Tailwind CSS
- **Backend**: WordPress with Custom REST API Plugin
- **Authentication**: JWT Authentication
- **Database**: MySQL (via WordPress)
- **Hosting**: Vercel (Frontend), Private Server (WordPress Backend)
- **Email Service**: SendGrid
- **Version Control**: Git

## 2. High-Level Architecture Overview

### System Components
1. **Frontend Application (SvelteKit)**
   - Handles user interface and interactions
   - Manages client-side routing
   - Communicates with WordPress REST API
   - Handles authentication state
   - Manages email communications via SendGrid
   - Processes memorial service scheduling and pricing
   - Handles multi-day event coordination

2. **WordPress Backend**
   - Provides REST API endpoints
   - Manages database operations
   - Handles media storage
   - Manages user authentication
   - Stores memorial service configurations
   - Maintains pricing rules and calculations

3. **Media Handling**
   - Embedded video codes integration
   - Media storage via WordPress
   - Content delivery through WordPress media library

### Data Flow
1. Client requests arrive at the SvelteKit frontend
2. Frontend communicates with WordPress REST API
3. WordPress processes requests and interacts with MySQL
4. Responses are formatted and returned to the frontend
5. Frontend renders the updated UI
6. Email notifications sent via SendGrid when required
7. Memorial calculator updates pricing in real-time
8. Schedule data persisted to WordPress metadata

## 3. Frontend Architecture

### Folder Structure
```
src/
├── app.css               # Global styles
├── app.html             # HTML template
├── hooks.server.ts      # Server hooks
├── lib/                 # Shared utilities
│   ├── components/     # Reusable components
│   │   └── MemorialCalculator.svelte  # Memorial pricing component
│   ├── types/          # TypeScript definitions
│   └── utils/          # Utility functions
└── routes/             # Application routes
    ├── api/            # API endpoints
    ├── login/          # Authentication pages
    ├── fd-form/        # Form handling
    └── calc/           # Calculator routes
```

### Key Technologies
- **Framework**: SvelteKit 5
- **Styling**: Tailwind CSS
- **State Management**: 
  - Props and cookies for basic state
  - Svelte 5 runes for complex reactive state
  - TypeScript for type safety
- **Email**: SendGrid integration for notifications

### Memorial Calculator Component
- Implements multi-day scheduling
- Manages location coordination
- Handles dynamic pricing calculations
- Uses Svelte 5 runes for state management
- Provides real-time cost updates
- Supports up to 3 locations per day
- Implements package-based pricing

### Routing Structure
- File-based routing using SvelteKit conventions
- Server-side and client-side routes clearly separated
- API routes handled through +server.ts/js files
- Calculator-specific routes for scheduling

### Authentication Flow
1. User credentials submitted to login endpoint
2. JWT token received from WordPress
3. Token stored in cookies
4. Protected routes verify token status

## 4. Backend Integration

### WordPress REST API
- Custom plugin extending WordPress REST API
- JWT authentication for secure communication
- Endpoints for user management and content
- Memorial service data storage and retrieval

### Key Endpoints
- `/api/auth`: Authentication handling
- `/api/user-meta`: User metadata operations
- `/api/tributes`: Tribute-related operations
- `/api/register`: User registration
- `/api/send-email`: Email functionality
- `/api/memorial-calculator`: Calculator data persistence

### Media Management
- WordPress media library for storage
- Custom endpoints for media operations
- Embedded video code integration

## 5. Deployment Architecture

### Frontend (Vercel)
- Automatic deployments from main branch
- Environment variables managed through Vercel
- Edge network for optimal performance

### Backend (Private Server)
- WordPress installation
- MySQL database
- Media storage
- Custom plugin deployment

## 6. Security Considerations

### Authentication
- JWT-based authentication
- Secure cookie handling
- Protected API endpoints

### Data Protection
- HTTPS enforcement
- Secure media handling
- WordPress security best practices
- Secure storage of pricing data

## 7. Future Considerations

### Planned Features
- Chat functionality
- Enhanced social features
- Payment gateway integration
- Advanced user roles
- Calendar integration for memorial services
- Location suggestions system
- Travel time estimation
- Advanced schedule validation

### Technical Debt
- Implementation of comprehensive testing
- Enhanced type safety
- CORS and rate limiting implementation
- Optimization of pricing calculations
- Schedule conflict detection

## 8. Development Workflow

### Local Development
1. Clone repository
2. Install dependencies (`npm install`)
3. Set up environment variables
4. Run development server (`npm run dev`)

### Deployment Process
1. Push changes to main branch
2. Automatic deployment via Vercel
3. WordPress updates handled separately

## 9. References

### Official Documentation
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [WordPress REST API Documentation](https://developer.wordpress.org/rest-api/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com/)

### Internal Resources
- WordPress Plugin Documentation (separate repository)
- API Endpoint Documentation
- Environment Setup Guide
- Memorial Calculator Technical Documentation
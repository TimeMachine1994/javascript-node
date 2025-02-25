# TributeStream Development Setup Guide

## Prerequisites

Before starting development, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)
- Git
- A code editor (VS Code recommended)
- Access to the WordPress backend
- SendGrid account for email functionality

## Initial Setup

### 1. Clone the Repository

```bash
git clone [repository-url]
cd TributestreamMegaMerge
```

### 2. Install Dependencies

```bash
npm install
npm install @sendgrid/mail # For email functionality
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# WordPress API
WORDPRESS_API_URL=your_wordpress_api_url
JWT_SECRET=your_jwt_secret

# Development
PUBLIC_SITE_URL=http://localhost:5173

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

Replace the placeholder values with your actual configuration.

## Project Structure

```
TributestreamMegaMerge/
├── src/                    # Source code
│   ├── app.css            # Global styles
│   ├── app.html           # HTML template
│   ├── hooks.server.ts    # Server hooks
│   ├── lib/               # Shared utilities
│   └── routes/            # Application routes
├── static/                # Static assets
├── client_docs/           # Documentation
└── [configuration files]  # Various config files
```

## Development Workflow

### 1. Starting the Development Server

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### 2. Working with Routes

- Routes are defined in `src/routes/`
- Each route can have:
  - `+page.svelte` (Page component)
  - `+page.server.ts` (Server-side logic)
  - `+server.ts` (API endpoints)

### 3. API Development

When working with API endpoints:
1. Endpoints are defined in `src/routes/api/`
2. Use appropriate HTTP methods (GET, POST, etc.)
3. Implement proper error handling
4. Test with the WordPress backend

Example API endpoint:
```typescript
// src/routes/api/example/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Your logic here
    return json({ success: true, data: {} });
  } catch (error) {
    return json({ error: true, message: error.message }, { status: 500 });
  }
};
```

### 4. Authentication Development

When working with authentication:
1. JWT tokens are handled automatically
2. Protected routes should check authentication status
3. Use the provided auth utilities

### 5. Email Integration

SendGrid is used for all email communications:
1. Ensure SENDGRID_API_KEY is set in .env
2. Use the provided email utilities
3. Test with SendGrid's sandbox mode in development

### 6. Styling

- Tailwind CSS is configured and ready to use
- Global styles are in `src/app.css`
- Follow the existing styling patterns

## Testing

Currently, the MVP version does not include testing infrastructure. This will be implemented in future versions.

## Common Development Tasks

### Adding a New Route

1. Create a new directory in `src/routes/`
2. Add necessary files (`+page.svelte`, `+page.server.ts`, etc.)
3. Implement the route logic
4. Update navigation if needed

### Creating an API Endpoint

1. Create a new directory in `src/routes/api/`
2. Add `+server.ts` file
3. Implement the endpoint logic
4. Document the endpoint in API documentation

### Working with WordPress

1. Ensure WordPress backend is accessible
2. Use the provided WordPress API utilities
3. Test endpoints with proper authentication

## Code Style Guidelines

### General

- Use TypeScript where possible
- Follow existing code patterns
- Use meaningful variable and function names
- Add comments for complex logic

### Component Structure

```svelte
<script lang="ts">
  // Imports
  // Props
  // State
  // Functions
</script>

<!-- Template -->
<div>
  <!-- Components -->
</div>

<style>
  /* Scoped styles */
</style>
```

### API Response Format

```typescript
// Success
{
  success: true,
  data: any
}

// Error
{
  error: true,
  message: string
}
```

## Deployment

### Development to Staging

1. Push changes to development branch
2. Vercel will automatically deploy
3. Test on staging environment

### Staging to Production

1. Create pull request to main branch
2. Review and approve
3. Merge to trigger production deployment

## Troubleshooting

### Common Issues

1. **WordPress API Connection**
   - Check API URL in .env
   - Verify WordPress is running
   - Check JWT token validity

2. **Build Errors**
   - Run `npm install` to update dependencies
   - Clear `.svelte-kit` cache
   - Check for TypeScript errors

3. **Runtime Errors**
   - Check browser console
   - Verify environment variables
   - Check network requests

4. **Email Issues**
   - Verify SendGrid API key
   - Check sender email verification
   - Review SendGrid logs

## Getting Help

1. Check existing documentation
2. Review code comments
3. Contact the development team

## Future Development

Areas planned for future development:
1. Testing infrastructure
2. Enhanced type safety
3. Performance optimizations
4. Additional social features
5. Payment integration

Remember to keep this documentation updated as new features are added or development practices change.
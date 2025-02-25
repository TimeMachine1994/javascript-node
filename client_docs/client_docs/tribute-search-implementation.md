# Tribute Search Implementation

## Overview

The tribute search functionality provides a real-time search interface for tributes stored in WordPress. It leverages SvelteKit's server-side rendering and WordPress's REST API for efficient data fetching and filtering.

## Architecture

### 1. Data Flow
```
Client Input → SvelteKit Route → WordPress API → Database Query → Filtered Results
```

### 2. Key Components

#### WordPress Backend (`/wp-json/tributestream/v1/tributes`)
- Handles database queries
- Supports pagination and search
- Search fields: `loved_one_name` and `slug`
- Returns paginated response

#### SvelteKit Server (`/routes/search/+page.server.ts`)
- Forwards search parameters to WordPress
- Handles error states
- Formats response data

#### Frontend UI (`/routes/search/+page.svelte`)
- Real-time search interface
- Pagination controls
- Loading states
- Error handling

## Implementation Details

### 1. Search Parameters
```typescript
interface SearchParams {
    page: string;        // Current page number (default: "1")
    per_page: string;    // Items per page (default: "10")
    search: string;      // Search query (optional)
}
```

### 2. WordPress Response Structure
```typescript
interface WordPressResponse {
    tributes: Array<{
        id: number;
        user_id: number;
        loved_one_name: string;
        slug: string;
        created_at: string;
        updated_at: string;
        custom_html?: string;
        phone_number: string;
        number_of_streams?: number;
    }>;
    total_pages: number;
    total_items: number;
    current_page: number;
}
```

### 3. Search Behavior
- Debounced input (300ms)
- Resets to page 1 on new search
- Server-side filtering
- Real-time UI updates

## Performance Considerations

1. Server-Side Search
   - WordPress handles filtering
   - Reduces client-side load
   - Efficient for large datasets

2. Pagination
   - Default: 10 items per page
   - Prevents large data transfers
   - Maintains performance

3. Debouncing
   - Reduces API calls
   - Improves user experience
   - Prevents server overload

## Error Handling

1. Network Errors
   - Displays user-friendly messages
   - Logs errors to console
   - Maintains UI stability

2. Empty States
   - Shows appropriate messages
   - Handles no results gracefully
   - Provides clear user feedback

## Usage Requirements

### WordPress Plugin Requirements
- TributeStream WordPress plugin installed
- JWT Authentication configured
- Proper database table setup

### Frontend Requirements
- SvelteKit 5
- TypeScript
- Tailwind CSS

## API Endpoints

### Search Endpoint
```
GET /api/tributes
```

Parameters:
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 10)
- `search` (optional): Search query

Response:
```json
{
    "tributes": [...],
    "total_pages": number,
    "total_items": number,
    "current_page": number
}
```

## User Interface Features

1. Search Input
   - Real-time updates
   - Clear visual feedback
   - Accessible design

2. Results Display
   - Clean card layout
   - HTML content support
   - Creation date display

3. Pagination Controls
   - Previous/Next buttons
   - Page indicators
   - Disabled state handling

## Testing Considerations

1. Search Functionality
   - Empty queries
   - Special characters
   - Long search terms

2. Pagination
   - First/last page edge cases
   - Page size handling
   - Navigation accuracy

3. Error States
   - Network failures
   - Invalid responses
   - Empty results

## Future Improvements

1. Potential Enhancements
   - Advanced filtering options
   - Sort functionality
   - Filter by date range
   - Category filtering

2. Performance Optimizations
   - Response caching
   - Preloading data
   - Virtual scrolling for large lists

## Last Updated: 2024-02-21
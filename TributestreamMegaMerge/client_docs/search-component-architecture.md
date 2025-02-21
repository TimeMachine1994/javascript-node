# Search Component Architecture

## Overview

The search implementation follows a three-layer architecture:
1. Data Fetching (Server)
2. Data Management (Client)
3. UI Rendering (Client)

## Implementation Details

### 1. Type Definitions (`/src/lib/types/api.ts`)

```typescript
// Base searchable item interface
export interface Tribute {
    id: number;
    title: string;
    content: string;
    status: string;
    date: string;
    author?: string;
    excerpt?: string;
}

// API response structure
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    total_pages: number;
    current_page: number;
}
```

### 2. Server-Side Data Loading (`/src/routes/+page.server.ts`)

```typescript
export const load: PageServerLoad = async ({ fetch }) => {
    const response = await fetch('/api/tributes?per_page=100');
    const data = await response.json();

    return {
        tributes: data.items || [],
        total: data.total || 0
    };
};
```

### 3. Search Component (`/src/lib/components/TributeSearch.svelte`)

Key features:
- Client-side filtering
- Real-time search updates
- Multi-term search support
- Loading and error states

## How to Reuse

### 1. Create Data Types

Define interfaces for your searchable items:

```typescript
export interface SearchableItem {
    id: number;
    // Add fields that should be searchable
    title: string;
    description: string;
    // Add any other relevant fields
}
```

### 2. Server Load Function

Create a load function in your page's server file:

```typescript
export const load: PageServerLoad = async ({ fetch }) => {
    const response = await fetch('/api/your-endpoint');
    const data = await response.json();

    return {
        items: data.items || [],
        total: data.total || 0
    };
};
```

### 3. Page Implementation

Use the search component in your page:

```svelte
<script lang="ts">
    import TributeSearch from '$lib/components/TributeSearch.svelte';
    
    const props = $props();
    const { items } = props.data;
</script>

<TributeSearch tributes={items} />
```

## Search Features

1. Multi-term Search
   - Splits search query into terms
   - Matches all terms (AND logic)
   - Case-insensitive matching

2. Real-time Updates
   - Updates as user types
   - No submit button needed
   - Instant feedback

3. Error Handling
   - Shows error messages
   - Graceful degradation
   - User-friendly feedback

## Performance Considerations

1. Client-side Search
   - Best for < 1000 items
   - Instant results
   - No server round-trips

2. Server-side Search
   - Better for large datasets
   - Reduces client memory usage
   - Requires API endpoint

3. Optimization Tips
   - Cache results when possible
   - Debounce search input
   - Use virtual scrolling for long lists

## Example: Custom Implementation

```typescript
// Custom search implementation
function searchItems<T>(
    items: T[],
    query: string,
    searchFields: (item: T) => string[]
): T[] {
    if (!query.trim()) return items;
    
    const terms = query.toLowerCase().split(' ');
    
    return items.filter(item => {
        const fields = searchFields(item);
        return terms.every(term =>
            fields.some(field => 
                field.toLowerCase().includes(term)
            )
        );
    });
}
```

## Best Practices

1. Type Safety
   - Use TypeScript interfaces
   - Define clear data structures
   - Validate API responses

2. Error Handling
   - Show loading states
   - Handle network errors
   - Provide feedback

3. User Experience
   - Instant feedback
   - Clear empty states
   - Responsive design

## Generic Search Component

### Component Structure

The generic search component should be implemented as follows:

```typescript
// GenericSearch.svelte
interface SearchableProps<T> {
    // Array of items to search through
    items: T[];
    
    // Function that returns searchable fields for each item
    getSearchableText: (item: T) => string[];
    
    // Function that renders each item
    renderItem: (item: T) => string | HTMLElement;
    
    // Optional configuration
    config?: {
        debounceMs?: number;      // Debounce delay in milliseconds
        minLength?: number;       // Minimum search query length
        placeholder?: string;     // Input placeholder text
        className?: string;       // Custom CSS classes
    };
}
```

### Example Usage

```typescript
// In your page component
import GenericSearch from '$lib/components/GenericSearch.svelte';

// Define search configuration for tributes
const searchConfig = {
    getSearchableText: (tribute: Tribute) => [
        tribute.title,
        tribute.content,
        tribute.author || ''
    ],
    renderItem: (tribute: Tribute) => `
        <div class="tribute-card">
            <h3>${tribute.title}</h3>
            <p>${tribute.content.substring(0, 100)}...</p>
            ${tribute.author ? `<span>By ${tribute.author}</span>` : ''}
        </div>
    `,
    config: {
        debounceMs: 300,
        minLength: 2,
        placeholder: "Search tributes..."
    }
};

// Use in template
<GenericSearch
    items={tributes}
    {...searchConfig}
/>
```

### Key Features

1. Generic Type Support
   - Works with any data structure
   - Type-safe implementation
   - Flexible rendering options

2. Configurable Search
   - Custom search fields
   - Adjustable debounce
   - Minimum query length

3. Extensible Design
   - Custom rendering
   - Custom filtering logic
   - Custom sorting options

### Implementation Notes

1. State Management:
```typescript
let searchQuery = $state('');
let filteredItems = $state<T[]>([]);
let isLoading = $state(false);
let error = $state<Error | null>(null);
```

2. Search Logic:
```typescript
function filterItems(items: T[], query: string): T[] {
    if (!query.trim()) return items;
    const terms = query.toLowerCase().split(' ');
    return items.filter(item => {
        const searchableText = getSearchableText(item);
        return terms.every(term =>
            searchableText.some(text =>
                text.toLowerCase().includes(term)
            )
        );
    });
}
```

3. Effect Handling:
```typescript
$effect(() => {
    if (searchQuery.length < (config?.minLength ?? 2)) {
        filteredItems = items;
        return;
    }
    filteredItems = filterItems(items, searchQuery);
});
```

## Accessibility and Testing

### Accessibility Features

1. ARIA Attributes
```html
<div role="search">
    <input
        type="search"
        aria-label="Search items"
        aria-controls="search-results"
        aria-expanded={hasResults}
    />
    <div
        id="search-results"
        role="listbox"
        aria-label="Search results"
    >
        <!-- Results here -->
    </div>
</div>
```

2. Keyboard Navigation
- Tab navigation between results
- Escape to clear search
- Arrow keys to navigate results
- Enter to select result

3. Screen Reader Support
- Announce number of results
- Announce loading states
- Clear feedback on no results

### Testing Considerations

1. Unit Tests
```typescript
// Example test cases
describe('GenericSearch', () => {
    test('filters items correctly', () => {
        const items = [/* test data */];
        const result = filterItems(items, 'test query');
        expect(result).toEqual([/* expected results */]);
    });

    test('handles empty search query', () => {
        const items = [/* test data */];
        const result = filterItems(items, '');
        expect(result).toEqual(items);
    });
});
```

2. Integration Tests
- Test with real data structures
- Verify search updates UI
- Check keyboard navigation
- Validate accessibility features

3. Performance Tests
- Test with large datasets
- Measure render times
- Verify debounce behavior
- Check memory usage

## Last Updated: 2024-02-21
# HomePage.svelte Refactoring Plan

## Current Issues
1. Mixed concerns between routing and component state
2. Form handling could be improved with SvelteKit 5's new form actions
3. State management could be better organized using Svelte 5's runes
4. Validation logic could be moved to a separate utility
5. No TypeScript interfaces for form data

## Proposed Changes

### 1. State Management
- Move state into a dedicated state machine class
- Use proper TypeScript interfaces for all state
- Leverage $state and $derived more effectively
- Consider moving shared state to stores

```typescript
interface FormState {
  searchQuery: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  isSubmitting: boolean;
  isSearching: boolean;
}

class HomePageState {
  pageState = $state<'home' | 'create'>('home');
  formData = $state<FormState>({
    searchQuery: '',
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    isSubmitting: false,
    isSearching: false
  });

  slugifiedText = $derived(this.formData.searchQuery
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  );

  customLink = $derived(
    `http://www.Tributestream.com/celebration-of-life-for-${this.slugifiedText}`
  );
}
```

### 2. Form Handling
- Use SvelteKit 5's form actions for better progressive enhancement
- Move form validation to a separate utility
- Add proper TypeScript types for form events and data
- Implement proper form error handling

```typescript
// Form validation utility
export const validateForm = {
  fullName: (value: string) => value.trim().length > 0,
  phoneNumber: (value: string) => /^\+?[\d\s-]+$/.test(value.trim()),
  emailAddress: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
};
```

### 3. Component Structure
- Split into smaller, more focused components:
  - SearchForm.svelte
  - CreateMemorialForm.svelte
  - CustomLinkDisplay.svelte
- Use proper TypeScript props and events

### 4. Routing
- Move navigation logic to page.server.ts
- Use SvelteKit's form actions for form submissions
- Implement proper loading and error states

### 5. TypeScript Improvements
- Add proper interfaces for all data structures
- Use strict type checking
- Add proper event typing
- Document component props and events

### 6. Error Handling
- Add proper error boundaries
- Implement form validation feedback
- Add loading states for async operations

## Implementation Steps

1. Create necessary TypeScript interfaces
2. Implement state machine class
3. Split component into smaller parts
4. Update form handling with new SvelteKit 5 patterns
5. Add proper error handling
6. Update routing logic
7. Add proper loading states
8. Implement proper form validation
9. Add TypeScript documentation

## Migration Path

1. Create new components alongside existing ones
2. Gradually migrate functionality
3. Test thoroughly
4. Remove old component once migration is complete

## Testing Strategy

1. Unit tests for validation logic
2. Component tests for form handling
3. Integration tests for navigation
4. End-to-end tests for full user flows

## Documentation Updates

1. Add TypeScript documentation
2. Document component props and events
3. Add usage examples
4. Document state management patterns
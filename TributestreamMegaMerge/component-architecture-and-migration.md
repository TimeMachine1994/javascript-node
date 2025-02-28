# Component Architecture, Migration Strategy, and Performance Optimization

## Overview

This document complements the rebuild plan by focusing on component architecture, migration strategy, and performance optimization. It outlines how to create a maintainable component system, provides a detailed migration path, and highlights key performance considerations for the Tributestream platform rebuild.

## Component Architecture

### Component Design System

The rebuild will implement a hierarchical component structure following these principles:

1. **Atomic Design Methodology**
   - Atoms: Basic UI elements (buttons, inputs, icons)
   - Molecules: Simple component combinations (search fields, form groups)
   - Organisms: Complex UI sections (forms, dashboards)
   - Templates: Page layouts without specific content
   - Pages: Complete page implementations

2. **Component Categorization**

```
src/lib/components/
├── ui/                # Base UI components (atoms)
│   ├── button/
│   ├── input/
│   ├── card/
│   ├── modal/
│   └── ...
├── forms/             # Form components (molecules)
│   ├── FormField.svelte
│   ├── ValidationMessage.svelte
│   ├── SearchInput.svelte
│   └── ...
├── layout/            # Layout components (templates)
│   ├── Header.svelte
│   ├── Footer.svelte
│   ├── Sidebar.svelte
│   └── ...
└── domain/            # Domain-specific components (organisms)
    ├── tribute/
    ├── calculator/
    ├── dashboard/
    └── ...
```

### Base UI Components

All base UI components should follow these guidelines:

1. **Props API**: Clear, typed props with sensible defaults
2. **Forwarded Events**: Forward DOM events where appropriate
3. **Accessibility**: ARIA attributes and keyboard navigation
4. **Styling**: TailwindCSS with consistent classes
5. **Variants**: Support multiple visual variants

Example Button Component:

```svelte
<!-- src/lib/components/ui/button/button.svelte -->
<script lang="ts">
  import { cn } from '$lib/utils';
  import { buttonVariants, type ButtonVariantProps } from './variants';
  
  type $$Props = ButtonVariantProps & {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    class?: string;
  };
  
  export let variant: $$Props['variant'] = 'default';
  export let size: $$Props['size'] = 'default';
  export let type: $$Props['type'] = 'button';
  export let disabled: $$Props['disabled'] = false;
  
  // Forward component classes
  const componentClass = cn(buttonVariants({ variant, size }), $$props.class);
</script>

<button
  type={type}
  class={componentClass}
  disabled={disabled}
  on:click
  on:mouseenter
  on:mouseleave
  {...$$restProps}
>
  <slot />
</button>
```

```typescript
// src/lib/components/ui/button/variants.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary"
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
```

### Form Components

Form components should be built to support both JavaScript-enhanced and traditional form submissions:

```svelte
<!-- src/lib/components/forms/FormField.svelte -->
<script lang="ts">
  import { cn } from '$lib/utils';
  import ValidationMessage from './ValidationMessage.svelte';
  
  export let name: string;
  export let label: string;
  export let type: string = 'text';
  export let value: string = '';
  export let error: string | null = null;
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let placeholder: string = '';
  
  // Generate a unique ID for the input
  const id = `field-${name}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Custom class for the input field
  const inputClass = cn(
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary", 
    error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
    $$props.class
  );
</script>

<div class="form-field mb-4">
  <label for={id} class="block text-sm font-medium text-gray-700 mb-1">
    {label}{required ? ' *' : ''}
  </label>
  
  <input
    {id}
    {name}
    {type}
    {placeholder}
    {required}
    {disabled}
    class={inputClass}
    value={value}
    on:input
    on:blur
    on:focus
    {...$$restProps}
  />
  
  {#if error}
    <ValidationMessage {error} />
  {/if}
  
  <slot />
</div>
```

### Domain-Specific Components

Domain components should be designed to handle specific business logic and UI patterns:

```svelte
<!-- src/lib/components/domain/tribute/TributeHeader.svelte -->
<script lang="ts">
  import type { Tribute } from '$lib/types/tribute';
  
  export let tribute: Tribute;
  
  // Format date for display
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
</script>

<header class="tribute-header bg-gray-100 p-6 rounded-lg mb-6">
  <h1 class="text-3xl font-bold text-gray-900">
    Celebration of Life for {tribute.deceased.fullName}
  </h1>
  
  {#if tribute.deceased.dateOfBirth && tribute.deceased.dateOfPassing}
    <p class="text-xl text-gray-600 mt-2">
      {formatDate(tribute.deceased.dateOfBirth)} - {formatDate(tribute.deceased.dateOfPassing)}
    </p>
  {/if}
  
  {#if tribute.scheduleDetails.date}
    <div class="mt-4 p-3 bg-white rounded-md shadow-sm">
      <p class="font-medium">
        Service Date: {formatDate(tribute.scheduleDetails.date)} 
        at {tribute.scheduleDetails.time}
      </p>
      
      {#if tribute.scheduleDetails.locations.length > 0}
        <p class="mt-1">
          Location: {tribute.scheduleDetails.locations[0].name}, 
          {tribute.scheduleDetails.locations[0].address}
        </p>
      {/if}
    </div>
  {/if}
</header>
```

### Component Composition Pattern

For complex UI sections, use composition to build maintainable components:

```svelte
<!-- src/lib/components/domain/calculator/Calculator.svelte -->
<script lang="ts">
  import { calculatorStore } from '$lib/stores/calculator';
  import type { Package } from '$lib/types/calculator';
  
  import StepIndicator from '$lib/components/ui/StepIndicator.svelte';
  import PackageSelector from './PackageSelector.svelte';
  import ScheduleSelector from './ScheduleSelector.svelte';
  import CartSummary from './CartSummary.svelte';
  
  export let packages: Package[];
  
  let currentStep = $state(1);
  const totalSteps = 3;
  
  // Step validation functions
  function canProceedToStep2(): boolean {
    return !!$calculatorStore?.selectedPackage;
  }
  
  function canProceedToStep3(): boolean {
    return $calculatorStore?.scheduleDays?.[0]?.locations?.length > 0;
  }
  
  // Handle next/previous navigation
  function goToNextStep() {
    if (currentStep < totalSteps) {
      currentStep++;
    }
  }
  
  function goToPreviousStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }
</script>

<div class="calculator">
  <StepIndicator {currentStep} {totalSteps} />
  
  <div class="step-content mt-6">
    {#if currentStep === 1}
      <h2 class="text-2xl font-bold mb-4">Select a Package</h2>
      <PackageSelector {packages} />
      <div class="mt-4 text-right">
        <button 
          on:click={goToNextStep} 
          disabled={!canProceedToStep2()} 
          class="btn btn-primary"
        >
          Next: Schedule
        </button>
      </div>
    {:else if currentStep === 2}
      <h2 class="text-2xl font-bold mb-4">Schedule Your Service</h2>
      <ScheduleSelector />
      <div class="mt-4 flex justify-between">
        <button on:click={goToPreviousStep} class="btn btn-outline">
          Previous: Packages
        </button>
        <button 
          on:click={goToNextStep} 
          disabled={!canProceedToStep3()} 
          class="btn btn-primary"
        >
          Next: Review
        </button>
      </div>
    {:else if currentStep === 3}
      <h2 class="text-2xl font-bold mb-4">Review & Checkout</h2>
      <CartSummary />
      <div class="mt-4 flex justify-between">
        <button on:click={goToPreviousStep} class="btn btn-outline">
          Previous: Schedule
        </button>
        <div>
          <button class="btn btn-secondary mr-2">Save and Pay Later</button>
          <button class="btn btn-primary">Pay Now</button>
        </div>
      </div>
    {/if}
  </div>
</div>
```

## Migration Strategy

### Phased Migration Approach

The migration from the existing codebase to the rebuilt application will follow these phases:

#### Phase 1: Foundation (2 weeks)
- Set up project structure and core architecture
- Implement base UI components
- Create data models and stores
- Establish TypeScript interfaces for all data

#### Phase 2: Key Routes (2 weeks)
- Implement home page with search and create functionality
- Build tribute page display
- Create funeral director form
- Set up booking calculator structure

#### Phase 3: API Integration (1 week)
- Copy and adapt existing API endpoints
- Ensure backward compatibility
- Implement type-safe API client utilities
- Test API integration

#### Phase 4: User Authentication (1 week)
- Implement login functionality
- Set up family dashboard shell
- Create routes for authenticated users
- Test authentication flows

#### Phase 5: Feature Completion (1 week)
- Finalize all remaining functionality
- Implement media upload and contributors
- Complete checkout process
- Add form validations

#### Phase 6: Parallel Testing (2 weeks)
- Run both implementations side by side
- Compare functionality and performance
- Fix any discrepancies or bugs
- Get feedback from stakeholders

#### Phase 7: Cutover (1 week)
- Switch routing to the new implementation
- Redirect old routes to new routes
- Monitor for issues
- Complete full transition

### Side-by-Side Development

To maintain the existing application while developing the new one:

1. **Shared API Layer**
   - Keep all existing API endpoints
   - Ensure new components use the same endpoints
   - Add type safety wrappers around API calls

2. **Feature Flags**
   - Implement feature flags for toggling between old and new implementations
   - Use query parameters to force specific versions for testing

3. **Parallel Deployments**
   - Set up staging environment with new implementation
   - Keep production on existing code until ready
   - Use branch deployments for testing

### Code Reuse Strategy

Identify and reuse valuable code from the existing implementation:

1. **Utility Functions**
   - Refactor and type existing utilities
   - Convert to TypeScript if needed
   - Test thoroughly before integration

2. **Business Logic**
   - Extract and reuse core algorithms
   - Add proper typing and documentation
   - Consider creating shared libraries

3. **API Endpoints**
   - Copy existing endpoint implementations
   - Add TypeScript types
   - Maintain API compatibility

### Data Migration

For user data and tributes:

1. **No Breaking Changes**
   - Ensure all existing data structures remain compatible
   - Add new fields as optional
   - Use data transformation where needed

2. **Database Schema**
   - Keep existing database schema
   - Document any new fields or relationships
   - Create migration scripts if needed

## Performance Optimization

### Initial Load Performance

1. **Code Splitting**
   - Split code by route using SvelteKit's automatic code splitting
   - Lazy-load components where appropriate
   - Use dynamic imports for heavy components

```typescript
// Example of dynamic import in a route
<script>
  import { onMount } from 'svelte';
  
  let MediaGallery;
  onMount(async () => {
    const module = await import('$lib/components/media/MediaGallery.svelte');
    MediaGallery = module.default;
  });
</script>

<div>
  {#if MediaGallery}
    <svelte:component this={MediaGallery} items={mediaItems} />
  {/if}
</div>
```

2. **Asset Optimization**
   - Implement responsive images with srcset
   - Lazy-load images below the fold
   - Use modern image formats (WebP, AVIF)

```svelte
<!-- Example of optimized image component -->
<script lang="ts">
  export let src: string;
  export let alt: string;
  export let width: number;
  export let height: number;
  export let lazy: boolean = true;
  
  // Generate WebP version if original is JPG/PNG
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
</script>

<picture>
  <source srcset={webpSrc} type="image/webp" />
  <img 
    {src} 
    {alt} 
    {width}
    {height}
    loading={lazy ? "lazy" : "eager"}
    class="max-w-full h-auto"
  />
</picture>
```

3. **Critical CSS**
   - Use TailwindCSS's built-in purging for minimal CSS
   - Inline critical styles in the head
   - Load non-critical styles asynchronously

### Runtime Performance

1. **Virtualization**
   - Use virtualized lists for long content
   - Only render visible items in large collections
   - Implement pagination for API results

```svelte
<!-- Example of virtualized list -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { MediaItem } from '$lib/types/tribute';
  
  export let items: MediaItem[] = [];
  
  let containerElement: HTMLDivElement;
  let visibleItems = $state<MediaItem[]>([]);
  let startIndex = $state(0);
  let endIndex = $state(10);
  
  // Update visible items when scrolling
  function updateVisibleItems() {
    if (!containerElement) return;
    
    const scrollTop = containerElement.scrollTop;
    const height = containerElement.clientHeight;
    
    // Calculate which items should be visible
    // Simplified example - a real implementation would be more sophisticated
    startIndex = Math.floor(scrollTop / 100);
    endIndex = Math.min(startIndex + Math.ceil(height / 100) + 3, items.length);
    
    visibleItems = items.slice(startIndex, endIndex);
  }
  
  onMount(() => {
    updateVisibleItems();
    containerElement.addEventListener('scroll', updateVisibleItems);
    window.addEventListener('resize', updateVisibleItems);
    
    return () => {
      containerElement.removeEventListener('scroll', updateVisibleItems);
      window.addEventListener('resize', updateVisibleItems);
    };
  });
</script>

<div 
  bind:this={containerElement}
  class="h-80 overflow-y-auto"
>
  <div style="height: {items.length * 100}px; position: relative;">
    {#each visibleItems as item, i}
      <div 
        style="position: absolute; top: {(startIndex + i) * 100}px; height: 100px; width: 100%;"
      >
        <div class="p-2 border rounded my-1">
          {item.title}
        </div>
      </div>
    {/each}
  </div>
</div>
```

2. **Memoization**
   - Use `$derived` for computed values
   - Cache expensive calculations
   - Avoid redundant re-renders

```typescript
// Example of memoized calculation
function createMemoizedCalculator() {
  const cache = new Map();
  
  return function calculateTotal(items: CartItem[]): number {
    // Create a cache key from the items
    const cacheKey = items.map(i => `${i.id}:${i.quantity}`).join('|');
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    // Calculate the total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Store in cache
    cache.set(cacheKey, total);
    return total;
  };
}

const calculateCartTotal = createMemoizedCalculator();
```

3. **Debouncing & Throttling**
   - Debounce input events
   - Throttle scroll handlers
   - Batch updates where possible

```typescript
// Utility function for debouncing
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Usage
const debouncedSearch = debounce((query: string) => {
  // Perform search
}, 300);
```

### Network Optimization

1. **Data Caching**
   - Implement client-side caching for API responses
   - Use localStorage for persistent data
   - Set appropriate cache headers

```typescript
// Simple cache utility
export function createApiCache<T>(ttl: number = 5 * 60 * 1000) {
  const cache = new Map<string, { data: T; timestamp: number }>();
  
  return {
    get(key: string): T | null {
      const entry = cache.get(key);
      
      if (!entry) return null;
      
      // Check if entry has expired
      if (Date.now() - entry.timestamp > ttl) {
        cache.delete(key);
        return null;
      }
      
      return entry.data;
    },
    
    set(key: string, data: T): void {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
    },
    
    clear(): void {
      cache.clear();
    }
  };
}

// Usage
const tributeCache = createApiCache<Tribute>(10 * 60 * 1000); // 10 minute TTL
```

2. **Optimistic UI Updates**
   - Update UI before server response
   - Roll back changes if request fails
   - Show pending state for actions

```svelte
<!-- Example of optimistic update -->
<script lang="ts">
  import { tributeStore } from '$lib/stores/tribute';
  
  export let tribute;
  
  let isUpdating = $state(false);
  let error = $state<string | null>(null);
  
  async function updateTributeTitle(newTitle: string) {
    isUpdating = true;
    error = null;
    
    // Store original value for rollback
    const originalTitle = tribute.deceased.fullName;
    
    // Optimistic update
    tributeStore.update(tributes => {
      const updatedTribute = { 
        ...tribute, 
        deceased: { 
          ...tribute.deceased, 
          fullName: newTitle 
        }
      };
      
      tributes.set(tribute.id, updatedTribute);
      return tributes;
    });
    
    try {
      // Actual API call
      const response = await fetch(`/api/tributes/${tribute.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'deceased.fullName': newTitle
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update tribute');
      }
      
      // Update with server response
      const updatedTribute = await response.json();
      tributeStore.addTribute(updatedTribute);
    } catch (err) {
      // Rollback on error
      error = err.message;
      tributeStore.update(tributes => {
        const currentTribute = tributes.get(tribute.id);
        if (currentTribute) {
          tributes.set(tribute.id, {
            ...currentTribute,
            deceased: {
              ...currentTribute.deceased,
              fullName: originalTitle
            }
          });
        }
        return tributes;
      });
    } finally {
      isUpdating = false;
    }
  }
</script>
```

### Monitoring & Measurement

1. **Performance Metrics**
   - Track core web vitals (LCP, FID, CLS)
   - Implement custom timing measurements
   - Monitor API response times

```typescript
// src/lib/utils/performance.ts
export function measureTimespan(label: string): () => void {
  const start = performance.now();
  console.log(`⏱️ Starting: ${label}`);
  
  return () => {
    const end = performance.now();
    const duration = end - start;
    console.log(`⏱️ Completed: ${label} in ${duration.toFixed(2)}ms`);
    
    // Report to analytics if needed
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_measurement', {
        event_category: 'performance',
        event_label: label,
        value: Math.round(duration)
      });
    }
  };
}

// Usage
function loadData() {
  const endMeasurement = measureTimespan('API: Load Tributes');
  
  // Load data
  
  endMeasurement(); // Captures and logs the duration
}
```

2. **Error Tracking**
   - Implement global error boundary
   - Log errors to monitoring service
   - Track user impact of errors

```typescript
// src/routes/+layout.svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  // Simple error tracking
  function setupErrorTracking() {
    const originalOnError = window.onerror;
    
    window.onerror = function(message, source, lineno, colno, error) {
      // Call original handler if it exists
      if (originalOnError) {
        originalOnError.apply(this, arguments);
      }
      
      // Log to console in development
      if (import.meta.env.DEV) {
        console.error('Global error:', { message, source, lineno, colno, error });
      }
      
      // Send to error tracking service in production
      if (import.meta.env.PROD) {
        fetch('/api/log-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            source,
            lineno,
            colno,
            stack: error?.stack || '',
            url: window.location.href,
            timestamp: new Date().toISOString()
          })
        }).catch(err => {
          console.error('Failed to log error:', err);
        });
      }
      
      // Return true to prevent default browser error handling
      return true;
    };
  }
  
  onMount(setupErrorTracking);
</script>

<slot />
```

## Conclusion

Following these guidelines for component architecture, migration strategy, and performance optimization will result in a robust, maintainable, and high-performing application. The phased approach to migration minimizes risk while allowing for incremental improvements.

By combining these practices with the data models, routing, and implementation plan outlined in the companion documents, the development team will have a comprehensive blueprint for successfully rebuilding the Tributestream platform with SvelteKit.

Key success factors include:
1. **Component consistency** through a well-designed system
2. **Smooth migration** using a phased approach
3. **Optimized performance** with best practices at every level
4. **Maintainable codebase** that follows SvelteKit conventions
5. **User-centric design** that preserves all existing functionality
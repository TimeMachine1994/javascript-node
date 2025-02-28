# SvelteKit Tribute Platform Routing and User Flows

## Overview

This document outlines the routing structure and key user flows for the Tributestream platform rebuild. It serves as a companion to the implementation plan and data models documentation, providing a clear picture of how users will navigate through the application and how the different routes interact with each other.

## Routing Structure

### Public Routes

| Route | Description | Access | 
|-------|-------------|--------|
| `/` | Home page with search and tribute creation | Public |
| `/search` | Search results page | Public |
| `/celebration-of-life-for-[slug]` | Public tribute page | Public |
| `/fd-form` | Funeral director form | Public |
| `/fd-form/confirmation` | Confirmation after FD form submission | Public |
| `/how-does-it-work` | Informational page | Public |
| `/why-tributestream` | Marketing/informational page | Public |

### Protected Routes

| Route | Description | Access | 
|-------|-------------|--------|
| `/family-dashboard` | Family dashboard | Authenticated Family Members |
| `/family-dashboard/upload_media` | Media upload page | Authenticated Family Members |
| `/family-dashboard/media_invite` | Invite contributors | Authenticated Family Members |
| `/family-dashboard/poctransfer` | Transfer point of contact | Authenticated Family Members |
| `/booking-calculator` | Service booking calculator | Authenticated Users |
| `/checkout` | Payment processing | Authenticated Users |
| `/user-metadata` | User profile settings | Authenticated Users |

### Authentication Routes

| Route | Description | Access | 
|-------|-------------|--------|
| `/login` | Login page | Public |
| `/api/auth` | Authentication API | Public |
| `/api/logout` | Logout endpoint | Authenticated Users |

### API Routes

| Route | Description | Access | 
|-------|-------------|--------|
| `/api/tributes` | Tribute CRUD operations | Mixed |
| `/api/tributes/by-slug` | Get tribute by slug | Public |
| `/api/user-meta` | User metadata operations | Authenticated |
| `/api/upload-media` | Media upload endpoint | Authenticated |
| `/api/invite-contributors` | Send invitations | Authenticated |
| `/api/transfer-poc` | Transfer POC | Authenticated |

## Key User Flows

### 1. Tribute Creation Flow

```
Home Page (/) 
→ Enter loved one's name + Click "Create Tribute"
→ Fill contact details
→ Submit form
→ Redirect to new tribute page (/celebration-of-life-for-[slug])
```

**State Management:**
- Initial tribute data stored in `tributeStore`
- Slug generated client-side using the deceased's name
- Form submission creates database entry and redirects

**Key Components:**
- SearchForm.svelte
- CreateTributeForm.svelte
- SlugPreview.svelte

### 2. Funeral Director Workflow

```
FD Form (/fd-form)
→ Enter deceased, family, and funeral details
→ Submit form
→ Confirmation page with payment options (/fd-form/confirmation)
→ Select "Pay Now" → Redirect to (/checkout)
   OR
→ Select "Pay Later" → Generate custom link for family
```

**State Management:**
- Form data stored in `formStore` during multi-step process
- On submission, data saved to API and stored in `tributeStore`
- Payment selection affects redirect destination

**Key Components:**
- FdFormWizard.svelte
- PaymentOptions.svelte
- CustomLinkDisplay.svelte

### 3. Service Booking & Payment

```
Booking Calculator (/booking-calculator)
→ Select package
→ Configure schedule and locations
→ Review cart and total
→ Select "Pay Now" → Redirect to (/checkout)
   OR
→ Select "Pay Later" → Save and redirect to family dashboard (/family-dashboard)
→ Complete payment → Confirmation and redirect to dashboard
```

**State Management:**
- Calculator state managed in `calculatorStore`
- Schedule and package selections in store
- Payment info only stored during checkout process
- Confirmation updates `tributeStore` with payment status

**Key Components:**
- PackageSelector.svelte
- ScheduleSelector.svelte
- LocationForm.svelte
- CartSummary.svelte
- PaymentForm.svelte

### 4. Family Dashboard Access

```
Home Page (/)
→ Search for tribute
→ Find tribute in results and click
→ Login prompt for family members (/login)
→ Authenticate
→ Redirect to family dashboard (/family-dashboard)
```

**State Management:**
- Search results in `searchResultsStore`
- Authentication state in `authStore`
- Dashboard data fetched from API and stored in `tributeStore`

**Key Components:**
- SearchResults.svelte
- LoginForm.svelte
- Dashboard.svelte
- ActionCards.svelte

### 5. Media Upload & Contributor Invitations

```
Family Dashboard (/family-dashboard)
→ Click "Upload Media"
→ Upload media page (/family-dashboard/upload_media)
→ Select and upload files
→ Return to dashboard
→ Click "Invite Contributors"
→ Contributors invite page (/family-dashboard/media_invite)
→ Enter email addresses
→ Send invitations
```

**State Management:**
- Media items tracked in `mediaStore`
- Upload progress tracked in component state
- Invitation status tracked in component state

**Key Components:**
- MediaUploader.svelte
- ContributorInviteForm.svelte
- MediaGallery.svelte

## Route Implementation Details

### Home Page (`/`)

**Page Structure:**
```svelte
<script>
  import { tributeStore } from '$lib/stores/tribute';
  import SearchForm from '$lib/components/forms/SearchForm.svelte';
  import CreateTributeForm from '$lib/components/forms/CreateTributeForm.svelte';
  
  let formState = $state('search'); // search, create, submitting, success
</script>

<div class="container">
  <h1>We Make Hearts Full Again</h1>
  
  {#if formState === 'search'}
    <SearchForm onCreateClick={() => formState = 'create'} />
  {:else if formState === 'create'}
    <CreateTributeForm onSubmitSuccess={() => formState = 'success'} onCancel={() => formState = 'search'} />
  {:else if formState === 'success'}
    <!-- Success message -->
  {/if}
</div>
```

**Server-side Data Loading:**
```typescript
// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  return {
    user: locals.user
  };
};
```

### Funeral Director Form (`/fd-form`)

**Page Structure:**
```svelte
<script>
  import { enhance } from '$app/forms';
  import { createFormHandler } from '$lib/utils/form-handler';
  
  let currentStep = $state(1);
  const totalSteps = 3;
  
  const handleSubmit = createFormHandler({
    onSubmit: () => {
      isSubmitting = true;
    },
    onSuccess: (data) => {
      goto('/fd-form/confirmation', { state: { formData: data } });
    },
    onError: (error) => {
      formError = error;
    },
    onComplete: () => {
      isSubmitting = false;
    }
  });
</script>

<div class="container">
  <h1>Memorial Information Form</h1>
  
  <!-- Step indicator -->
  <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
  
  <form method="POST" use:enhance={handleSubmit}>
    {#if currentStep === 1}
      <!-- Director and Deceased Information -->
    {:else if currentStep === 2}
      <!-- Family Member Information -->
    {:else if currentStep === 3}
      <!-- Memorial Service Details -->
    {/if}
    
    <!-- Navigation buttons -->
    <div class="flex justify-between">
      <button type="button" disabled={currentStep === 1} on:click={() => currentStep--}>
        Previous
      </button>
      
      {#if currentStep < totalSteps}
        <button type="button" on:click={() => currentStep++}>Next</button>
      {:else}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      {/if}
    </div>
  </form>
</div>
```

**Server-side Form Handling:**
```typescript
// src/routes/fd-form/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    
    // Validate form data
    
    // Process the form submission
    try {
      const response = await fetch('/api/tributes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Format data from form
        })
      });
      
      if (!response.ok) {
        return fail(400, { 
          error: true, 
          message: 'Failed to submit form'
        });
      }
      
      const result = await response.json();
      
      // Redirect to confirmation page
      throw redirect(303, `/fd-form/confirmation?id=${result.id}`);
    } catch (error) {
      if (error.status === 303) throw error;
      
      return fail(500, { 
        error: true, 
        message: 'Server error'
      });
    }
  }
};
```

### Booking Calculator (`/booking-calculator`)

**Page Structure:**
```svelte
<script>
  import { calculatorStore } from '$lib/stores/calculator';
  import PackageSelector from '$lib/components/calculator/PackageSelector.svelte';
  import ScheduleSelector from '$lib/components/calculator/ScheduleSelector.svelte';
  import CartSummary from '$lib/components/calculator/CartSummary.svelte';
  
  export let data;
  
  // Initialize store from data or params
  $effect(() => {
    if (data.tributeId && !$calculatorStore?.meta?.tributeId) {
      calculatorStore.initialize(data.tributeId);
    }
  });
  
  function handlePayNow() {
    calculatorStore.finalize();
    goto('/checkout');
  }
  
  function handlePayLater() {
    calculatorStore.finalize();
    // Save to API
    goto('/family-dashboard');
  }
</script>

<div class="container">
  <h1>Memorial Service Calculator</h1>
  
  <div class="grid grid-cols-3 gap-8">
    <div class="col-span-2">
      <PackageSelector packages={data.packages} />
      <ScheduleSelector />
    </div>
    
    <div class="col-span-1">
      <CartSummary cart={$calculatorStore?.cart} />
      
      <div class="mt-8 space-y-4">
        <button class="btn btn-primary w-full" on:click={handlePayNow}>
          Save and Pay Now
        </button>
        
        <button class="btn btn-secondary w-full" on:click={handlePayLater}>
          Save and Pay Later
        </button>
      </div>
    </div>
  </div>
</div>
```

**Server-side Data Loading:**
```typescript
// src/routes/booking-calculator/+page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
  // Check authentication
  if (!locals.user) {
    throw redirect(302, `/login?redirectTo=${url.pathname}`);
  }
  
  // Load packages from API
  const packagesResponse = await fetch('/api/packages');
  const packages = await packagesResponse.json();
  
  // Get tribute ID from query params
  const tributeId = url.searchParams.get('tributeId');
  
  // If tributeId is present, load tribute data
  let tribute = null;
  if (tributeId) {
    const tributeResponse = await fetch(`/api/tributes/${tributeId}`);
    if (tributeResponse.ok) {
      tribute = await tributeResponse.json();
    }
  }
  
  return {
    packages,
    tribute,
    tributeId
  };
};
```

### Family Dashboard (`/family-dashboard`)

**Page Structure:**
```svelte
<script>
  import { tributeStore } from '$lib/stores/tribute';
  import DashboardHeader from '$lib/components/dashboard/DashboardHeader.svelte';
  import ActionButtons from '$lib/components/dashboard/ActionButtons.svelte';
  import ScheduleDisplay from '$lib/components/dashboard/ScheduleDisplay.svelte';
  
  export let data;
  
  // Update tribute store with dashboard data
  $effect(() => {
    if (data.tribute) {
      tributeStore.addTribute(data.tribute);
    }
  });
</script>

<div class="container">
  <DashboardHeader tribute={data.tribute} />
  
  <ActionButtons />
  
  <ScheduleDisplay schedule={data.tribute?.scheduleDetails} />
  
  <!-- Additional dashboard sections -->
</div>
```

**Server-side Data Loading:**
```typescript
// src/routes/family-dashboard/+page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Check authentication
  if (!locals.user) {
    throw redirect(302, '/login?redirectTo=/family-dashboard');
  }
  
  // Get user's tribute data
  const userId = locals.user.id;
  const tributeResponse = await fetch(`/api/tributes?userId=${userId}`);
  
  if (!tributeResponse.ok) {
    return {
      error: 'Failed to load tribute data'
    };
  }
  
  const tributes = await tributeResponse.json();
  
  // Typically family members will have one tribute
  const tribute = tributes[0] || null;
  
  // Get user metadata
  const metaResponse = await fetch(`/api/user-meta?userId=${userId}`);
  const userMeta = metaResponse.ok ? await metaResponse.json() : null;
  
  return {
    tribute,
    userMeta
  };
};
```

## Authentication and Authorization

### Login Page (`/login`)

```svelte
<script>
  import { enhance } from '$app/forms';
  import { authStore } from '$lib/stores/user';
  import { goto } from '$app/navigation';
  
  export let data;
  
  let email = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  let error = $state('');
  
  // Get redirect destination from query params
  const redirectTo = data.redirectTo || '/family-dashboard';
  
  async function handleSubmit(event) {
    event.preventDefault();
    isSubmitting = true;
    error = '';
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }
      
      const userData = await response.json();
      
      // Update auth store
      authStore.login(userData.user, userData.tokens);
      
      // Redirect to intended destination
      goto(redirectTo);
    } catch (err) {
      error = err.message;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="container">
  <h1>Login</h1>
  
  {#if error}
    <div class="error">{error}</div>
  {/if}
  
  <form on:submit={handleSubmit}>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} required />
    </div>
    
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} required />
    </div>
    
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Logging in...' : 'Login'}
    </button>
  </form>
</div>
```

### Authentication Hooks

```typescript
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Get auth cookie
  const authCookie = event.cookies.get('auth_token');
  
  if (authCookie) {
    try {
      // Validate token
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${authCookie}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        event.locals.user = userData;
      } else {
        // Token invalid, clear cookie
        event.cookies.delete('auth_token', { path: '/' });
      }
    } catch (error) {
      console.error('Auth validation error:', error);
    }
  }
  
  // Continue to route handler
  return await resolve(event);
};
```

## Slug Generation and Dynamic Routes

### Slug Generation Utility

```typescript
// src/lib/utils/slugify.ts
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export function generateTributeSlug(deceasedName: string): string {
  return slugify(deceasedName);
}
```

### Dynamic Tribute Route

```typescript
// src/routes/celebration-of-life-for-[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTributeBySlug } from '$lib/api/tribute';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;
  
  // Fetch tribute data by slug
  const tribute = await getTributeBySlug(slug);
  
  if (!tribute) {
    throw error(404, {
      message: 'Tribute not found'
    });
  }
  
  return {
    tribute
  };
};
```

```svelte
<!-- src/routes/celebration-of-life-for-[slug]/+page.svelte -->
<script>
  import { tributeStore } from '$lib/stores/tribute';
  import TributeHeader from '$lib/components/memorial/TributeHeader.svelte';
  import MemorialDetails from '$lib/components/memorial/MemorialDetails.svelte';
  import MediaGallery from '$lib/components/memorial/MediaGallery.svelte';
  
  export let data;
  const { tribute } = data;
  
  // Add tribute to store
  $effect(() => {
    if (tribute) {
      tributeStore.addTribute(tribute);
    }
  });
</script>

<div class="tribute-page">
  <TributeHeader tribute={tribute} />
  
  <MemorialDetails 
    scheduleDetails={tribute.scheduleDetails}
    deceased={tribute.deceased}
  />
  
  {#if tribute.mediaItems?.length}
    <MediaGallery items={tribute.mediaItems} />
  {/if}
</div>
```

## Conclusion

This routing and user flows document provides a comprehensive guide to implementing the navigation structure and key user journeys in the rebuilt Tributestream platform. By following these patterns, the application will have:

1. **Consistent User Experience** - Clear and logical navigation paths
2. **Type-Safe Routes** - Properly typed parameters and data loading
3. **Protected Routes** - Proper authentication and authorization
4. **Organized Code Structure** - Separation of concerns between client and server

The implementation should follow these patterns to ensure a cohesive application structure that aligns with the data models and overall architecture plan described in the companion documents.
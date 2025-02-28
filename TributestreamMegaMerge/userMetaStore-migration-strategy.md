# UserMetaStore Migration Strategy

## Current Architecture Analysis

The TributestreamMegaMerge project currently has several approaches to user data management:

1. **Cookie-based approach** in `+layout.server.ts` - Parses user data from cookies
2. **User store** in `user.ts` - Manages authentication state
3. **UserMetadata store** in `user.ts` - Basic metadata management
4. **Master store** in `userStore.ts` - Combined data store with local storage persistence

This fragmentation creates several challenges:
- Inconsistent data access patterns
- Duplicate logic for parsing and transforming data
- Multiple sources of truth
- No centralized caching strategy

## Migration Strategy

### Phase 1: Parallel Implementation

1. **Implement `userMetaStore.ts`** without removing existing code
2. **Update `+layout.server.ts`** to use the new store while maintaining backward compatibility
3. **Add deprecation notices** to old stores and methods

```typescript
// In the old UserMetadataStore
/**
 * @deprecated Use the new userMetaStore instead
 * See: src/lib/stores/userMetaStore.ts
 */
export const userMetadataStore = createUserMetadataStore();
```

### Phase 2: Component Migration

Target the most active components first for migration:

1. **Identify components** that directly use user metadata
2. **Create migration examples** for each pattern
3. **Gradually update components** to use the new store

Example migration pattern:

**Before:**
```typescript
<script>
  import { userMetadataStore } from '$lib/stores/user';
  
  let metadata;
  userMetadataStore.subscribe(value => {
    metadata = value;
  });
</script>

<h1>Welcome, {metadata?.firstName || 'Guest'}</h1>
```

**After:**
```typescript
<script>
  import { page } from '$app/stores';
  import { userMetaStore } from '$lib/stores/userMetaStore';
  
  $: userId = $page.data.wpUserData?.metaResult?.user_id.toString();
  $: userName = userId 
    ? userMetaStore.getUserProperty(
        userId, 
        'memorial_form_data.familyMember.name', 
        'Guest'
      ) 
    : 'Guest';
</script>

<h1>Welcome, {userName}</h1>
```

### Phase 3: Complete Transition

1. **Add data adapters** if needed for legacy code
2. **Remove deprecated code** after all components are migrated
3. **Consolidate type definitions** if needed

## Integration with Existing Architecture

### Hook Server Integration

The `hooks.server.ts` file currently extracts user data from cookies and puts it in `event.locals`. The new userMetaStore implementation will work alongside this by:

1. Using the JWT token provided by `event.locals.jwt` or cookies
2. Accessing user ID from cookies or `event.locals.user`
3. Providing a seamless interface between server and client components

### Authentication Flow Integration

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Login Process  │────►│  hooks.server   │────►│  userMetaStore  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                                ┌────────────────┐
                                                │                │
                                                │ layout.server  │
                                                │                │
                                                └────────────────┘
```

- Login sets cookies with JWT and user data
- `hooks.server.ts` reads cookies and populates `event.locals`
- `userMetaStore` uses the JWT for API calls
- `layout.server.ts` provides the data to all routes

### Store Interaction

The userMetaStore will interact with other stores as needed:

1. **Authentication store** (`authStore`): For authentication state
2. **Calculator store**: Can consume user data from userMetaStore
3. **Tribute store**: Can be updated to use standardized user data

```
┌─────────────────┐
│                 │
│   authStore     │
│                 │
└─────────────────┘
        │
        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  userMetaStore  │────►│ calculatorStore │     │  tributeStore   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                                │
        └────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────────┐
                    │                    │
                    │    Components      │
                    │                    │
                    └────────────────────┘
```

## Testing Strategy

### Unit Tests

1. **Store Creation**: Test initial state
2. **Cache Logic**: Test cache validity checks
3. **Data Transformation**: Test parsing functions
4. **Error Handling**: Test error states and fallbacks

### Integration Tests

1. **API Interaction**: Test with mocked API endpoints
2. **Authentication Flow**: Test with simulated authentication
3. **Layout Integration**: Test with SvelteKit's testing utilities

### End-to-End Tests

1. **Complete User Journey**: From login to data display
2. **Data Persistence**: Through navigation and page refreshes
3. **Error Recovery**: From network failures and invalid data

## Known Edge Cases

1. **Multiple User Sessions**: Handle when multiple users access from same browser
2. **Expired Tokens**: Refresh flow when JWT expires
3. **Race Conditions**: When multiple components update the same data
4. **Data Migration**: When data format changes

## Code Examples for Common Patterns

### Server-Side Data Loading

```typescript
// In +page.server.ts
import { getUserMetadata } from '$lib/stores/userMetaStore';

export const load = async ({ cookies, parent }) => {
  // Get parent data from layout
  const parentData = await parent();
  
  // If we already have user data from the layout, use it
  if (parentData.userData?.length) {
    return {
      // Add page-specific data here
      pageUserData: parentData.userData[0]
    };
  }
  
  // Otherwise, fetch it directly if needed
  const token = cookies.get('jwt_token');
  const userId = cookies.get('user_id');
  
  if (!token || !userId) return { pageUserData: null };
  
  const { userData } = await getUserMetadata(userId, token);
  return {
    pageUserData: userData[0]
  };
};
```

### Client-Side Data Access

```svelte
<script>
  import { page } from '$app/stores';
  import { userMetaStore } from '$lib/stores/userMetaStore';
  
  // Get data loaded by server
  $: userData = $page.data.userData?.[0];
  
  // Access specific property with direct store method
  $: userId = $page.data.wpUserData?.metaResult?.user_id.toString();
  $: userName = userId 
    ? userMetaStore.getUserProperty(
        userId,
        'memorial_form_data.deceased.name',
        'Unknown'
      )
    : 'Unknown';
</script>

<div>
  <h1>Memorial for {userName}</h1>
  
  {#if userData}
    <p>Memorial Date: {userData.memorial_form_data.memorial.date}</p>
  {/if}
</div>
```

### Data Updates

```svelte
<script>
  import { page } from '$app/stores';
  import { userMetaStore } from '$lib/stores/userMetaStore';
  
  $: userId = $page.data.wpUserData?.metaResult?.user_id.toString();
  
  // Get token from cookie
  function getToken() {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt_token='))
      ?.split('=')[1];
  }
  
  async function updateMemorialDate(newDate) {
    if (!userId) return false;
    
    const token = getToken();
    if (!token) return false;
    
    // Get current metadata
    const userData = userMetaStore.getUserMetadata(userId);
    if (!userData) return false;
    
    // Create updated version
    const updatedMemorialData = {
      ...userData.memorial_form_data,
      memorial: {
        ...userData.memorial_form_data.memorial,
        date: newDate
      }
    };
    
    // Update in the store/API
    return await userMetaStore.updateUserMeta(
      userId,
      token,
      'memorial_form_data',
      updatedMemorialData
    );
  }
</script>

<input 
  type="date" 
  value={$page.data.userData?.[0]?.memorial_form_data.memorial.date}
  on:change={(e) => updateMemorialDate(e.target.value)}
/>
```

## Future Expansion

The userMetaStore architecture is designed to be extensible:

1. **Additional Metadata Types**: New metadata keys can be added without changing the core structure
2. **Offline Support**: Add offline capabilities with IndexedDB persistence
3. **Real-time Updates**: Add WebSocket support for real-time data synchronization
4. **Analytics Integration**: Track user activity and metadata changes
5. **Multi-user Support**: Expand to handle multiple user profiles

## Timeline Recommendation

| Phase | Timeframe | Key Milestones |
|-------|-----------|----------------|
| Setup | Week 1 | Implement core userMetaStore, update layout.server.ts |
| Migration | Weeks 2-3 | Migrate key components, add deprecation notices |
| Testing | Week 4 | Comprehensive testing and bug fixes |
| Cleanup | Week 5 | Remove deprecated code, finalize documentation |

## Conclusion

This migration strategy provides a structured approach to implementing the userMetaStore while minimizing disruption to the existing application. By following this plan, the team can gradually transition to the new architecture while maintaining compatibility with existing code.

The end result will be a more maintainable, performant, and type-safe approach to user metadata management that serves as a solid foundation for future development.
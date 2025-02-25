# Page Server Fixes

## Current Issues

1. **Syntax Errors**
   - Missing closing brackets
   - Improper error handling structure
   - Incomplete function definitions

2. **Data Mapping Issues**
   - Form data email field mismatch (`data.email` vs `point_of_contact_email`)
   - Inconsistent data structure with TributeCreateRequest type

3. **Error Handling**
   - Missing proper error handling for registration response
   - `fail` function used but not imported
   - Incomplete error state management

4. **Cookie Management**
   - `userId` cookie set but value never assigned
   - Token handling could be more robust

5. **Type System**
   - `PageServerLoad` imported but no load function defined
   - Missing proper return type definitions

## Proposed Changes

### 1. File Structure
```typescript
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions, RequestEvent } from './$types';
import type { TributeCreateRequest } from '$lib/types/api';

export const load: PageServerLoad = async () => {
    return {
        // Add any required initial data
    };
};

// Rest of the file...
```

### 2. Form Data Handling
The form data should be properly mapped to match the TributeCreateRequest interface:

```typescript
const data: TributeCreateRequest = {
    lovedOneName: formData.get('searchQuery') as string,
    point_of_contact_name: formData.get('fullName') as string,
    point_of_contact_phone: formData.get('phoneNumber') as string,
    point_of_contact_email: formData.get('emailAddress') as string,
};
```

### 3. Registration and Authentication Flow
1. Logout existing user
2. Register new user with generated password
3. Authenticate user
4. Set cookies with proper security options

### 4. Error Handling
Add proper error handling for each step:
- Form data validation
- Registration response
- Authentication response
- Cookie setting

### 5. Return Values
The action should return appropriate values for different scenarios:
- Success: Redirect or success message
- Validation Error: Return validation errors
- Registration Error: Return registration error message
- Authentication Error: Return auth error message

## Implementation Plan

1. Import required dependencies and types
2. Implement password generator function (existing implementation is good)
3. Implement form data validation
4. Add proper error handling for each step
5. Fix data mapping issues
6. Implement proper cookie management
7. Add appropriate return values
8. Add load function if needed
9. Add proper TypeScript types

## Security Considerations

1. Password Generation
   - Current implementation is secure
   - Generates 16-character passwords
   - Includes all required character types
   - Uses random character placement

2. Cookie Security
   - Use HttpOnly flag
   - Set Secure flag
   - Use SameSite=Strict
   - Set appropriate expiration

3. Authentication
   - Clear existing sessions before new registration
   - Proper error handling for auth failures
   - Secure token storage

## Next Steps

1. Switch to Code mode to implement these changes
2. Test the registration flow
3. Verify error handling
4. Test cookie management
5. Validate security measures

## Migration Notes

The changes should be backward compatible as they maintain the same basic flow while improving error handling and type safety. No database changes are required.
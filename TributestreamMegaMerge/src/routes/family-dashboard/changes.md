# Family Dashboard Page Server Changes

## Current Issue

The family dashboard page server load function fails with:
```
[Load Error] - Error in schedule page load: TypeError: redirect2 is not a function
```

This occurs because:
1. The redirect variable shadows the imported redirect function
2. The redirect function is called with an incorrect parameter format

## Required Changes

### 1. Fix Variable Shadowing
```typescript
// Before
let redirect = '';

// After
let redirectUrl = '';  // Rename to avoid shadowing
```

### 2. Fix Redirect Implementation
```typescript
// Before
throw redirect(303, {redirect});

// After
throw redirect(303, redirectUrl);  // Pass URL string directly
```

### 3. Fix Property Access
```typescript
// Before
if (metaData?.CalculatorData?.meta?.status) {

// After
if (metaData?.calculator_data?.meta?.status) {
```

## Implementation Steps

1. Rename the redirect variable to redirectUrl
2. Update all references to use redirectUrl
3. Fix the redirect function call to pass the URL string
4. Update property access to match UserMetadata interface

## Expected Behavior

- The page should properly redirect based on calculator status
- No TypeErrors should occur during redirect
- Proper type safety with UserMetadata interface

The focus is on ensuring the family dashboard loads correctly and handles redirects properly, without any runtime errors.
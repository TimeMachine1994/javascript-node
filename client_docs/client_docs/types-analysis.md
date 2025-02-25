# Types Analysis
Last Updated: 2/20/2025

## Overview
This document analyzes the type definitions across three key files in the TributeStream application:
- memorial-calculator.ts
- user-store.ts
- user-metadata.ts

## Type Relationships

### Memorial Calculator Types

The memorial-calculator.ts file defines the core data structures for the memorial calculator functionality:

1. **Base Types**:
   - `Director`: Funeral director information (firstName, lastName)
   - `FamilyMember`: Family member details (firstName, lastName, dob)
   - `Deceased`: Deceased person information (firstName, lastName, dob, dop)
   - `Contact`: Contact information (email, phone)
   - `Location`: Event location details (name, address, travelExceedsHour, startTime, duration, notes)

2. **Composite Types**:
   - `ScheduleDay`: Groups locations by date
   - `Memorial`: Basic memorial event details
   - `MemorialFormData`: Comprehensive form data structure
   - `Package`: Service package information
   - `CartItem`: Shopping cart item
   - `OrderData`: Complete order information structure

### User Store Types

The user-store.ts file manages user state and authentication:

1. **Core Types**:
   - `UserStore`: Main store structure (isLoading, error, data)
   - `ParsedCookieData`: Cookie data structure (token, userData)
   - `UserDataError`: Custom error handling

2. **Error Handling**:
   - `USER_DATA_ERROR_TYPES`: Enumeration of error types
   - `UserDataErrorType`: Type for error constants

### User Metadata Types

The user-metadata.ts file defines user-related data structures:

1. **Core Types**:
   - `UserMetadata`: Top-level user data container
   - `CalculatorData`: Calculator-specific user data
   - `UserMetadataPageData`: Structured view data

2. **Shared Types**:
   - `MemorialFormData`: Similar to memorial-calculator but with slight differences
   - `Location`: Shared with memorial-calculator
   - `ScheduleDay`: Shared with memorial-calculator
   - `CartItem`: Shared with memorial-calculator

## Key Observations

1. **Type Duplication**:
   - There is some duplication between memorial-calculator.ts and user-metadata.ts
   - `MemorialFormData` exists in both files with slightly different structures
   - Consider consolidating these definitions

2. **Data Flow**:
   - `UserStore` serves as the central state container
   - `UserMetadata` acts as the data persistence layer
   - `memorial-calculator` types define the form and calculation structures

3. **Integration Points**:
   - Calculator data flows into user metadata
   - User store manages the loading and error states
   - Memorial form data is stored in user metadata

## Recommendations

1. **Type Consolidation**:
   - Merge duplicate types into a shared location
   - Create a single source of truth for shared interfaces

2. **Structure Improvements**:
   - Consider creating a separate types directory for shared types
   - Implement strict typing for the [key: string]: any in UserMetadata

3. **Documentation**:
   - Add more detailed JSDoc comments for complex types
   - Document the relationships between different type files

## Usage Patterns

1. **Form Handling**:
   - `MemorialFormData` structures form input
   - `OrderData` handles final submission data

2. **State Management**:
   - `UserStore` manages global user state
   - `ParsedCookieData` handles authentication state

3. **Data Persistence**:
   - `UserMetadata` defines the structure for stored data
   - `MetaEntry` handles WordPress metadata format

## Security Considerations

1. **Authentication**:
   - Token handling through ParsedCookieData
   - Error handling for invalid tokens

2. **Data Validation**:
   - Consider adding validation rules to types
   - Implement runtime type checking

## Future Considerations

1. **Type Evolution**:
   - Plan for extending UserMetadata
   - Consider versioning for MemorialFormData

2. **Integration**:
   - Document type usage in API endpoints
   - Maintain consistency with backend types
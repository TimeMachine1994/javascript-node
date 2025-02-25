# TributeStream API Documentation

## Overview
This document details the API endpoints available in the TributeStream platform, covering both the SvelteKit frontend API routes and WordPress backend integration.

## Authentication

### Login
- **Endpoint**: `/api/auth`
- **Method**: POST
- **Purpose**: Authenticate user and receive JWT token
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "number",
      "username": "string",
      "email": "string"
    }
  }
  ```

### Logout
- **Endpoint**: `/api/logout`
- **Method**: POST
- **Purpose**: Clear authentication tokens
- **Authentication**: Required
- **Response**: 200 OK

### Register
- **Endpoint**: `/api/register`
- **Method**: POST
- **Purpose**: Create new user account
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully"
  }
  ```

## User Management

### Get User Role
- **Endpoint**: `/api/getRole`
- **Method**: GET
- **Purpose**: Retrieve user's role
- **Authentication**: Required
- **Response**:
  ```json
  {
    "role": "string"
  }
  ```

### User Metadata
- **Endpoint**: `/api/user-meta`
- **Method**: GET/POST
- **Purpose**: Manage user metadata
- **Authentication**: Required
- **GET Response**:
  ```json
  {
    "meta": {
      "key": "value"
    }
  }
  ```
- **POST Request Body**:
  ```json
  {
    "meta_key": "string",
    "meta_value": "string"
  }
  ```

## Tributes

### Search Tributes
- **Endpoint**: `/api/tributes`
- **Method**: GET
- **Purpose**: Search and retrieve tributes with pagination
- **Query Parameters**:
  - search (optional): string - Search term for loved_one_name or slug
  - page (optional): number - Page number (default: 1)
  - per_page (optional): number - Items per page (default: 10)
- **Response**:
  ```json
  {
    "tributes": [
      {
        "id": "number",
        "user_id": "number",
        "loved_one_name": "string",
        "slug": "string",
        "created_at": "string",
        "updated_at": "string",
        "custom_html": "string",
        "phone_number": "string",
        "number_of_streams": "number"
      }
    ],
    "total_pages": "number",
    "total_items": "number",
    "current_page": "number"
  }
  ```

### Get Single Tribute
- **Endpoint**: `/api/tributes/[id]`
- **Method**: GET
- **Purpose**: Retrieve specific tribute
- **Parameters**:
  - id: Tribute ID
- **Response**:
  ```json
  {
    "id": "number",
    "user_id": "number",
    "loved_one_name": "string",
    "slug": "string",
    "created_at": "string",
    "updated_at": "string",
    "custom_html": "string",
    "phone_number": "string",
    "number_of_streams": "number"
  }
  ```

## Email

### Send Email
- **Endpoint**: `/api/send-email`
- **Method**: POST
- **Purpose**: Send system emails
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "to": "string",
    "subject": "string",
    "template": "string",
    "data": "object"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Email sent successfully"
  }
  ```

## WordPress Integration

### Media Handling
All media-related operations are handled through the WordPress REST API endpoints. The frontend communicates with these endpoints through the WordPress REST API.

- Media Upload
- Media Retrieval
- Media Deletion

These operations are managed through the standard WordPress REST API endpoints with JWT authentication.

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": true,
  "message": "Error description",
  "code": "error_code"
}
```

Common HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

Currently, no rate limiting is implemented in the MVP version. This will be addressed in future updates.

## Security Notes

1. All endpoints require HTTPS
2. Authentication is handled via JWT tokens
3. Sensitive operations require appropriate user roles
4. File uploads are restricted to authorized users only

## Future API Enhancements

Planned API improvements for future releases:
1. Chat system endpoints
2. Enhanced social features
3. Payment gateway integration
4. Advanced user role management
5. Rate limiting implementation
6. CORS policy refinement
7. Advanced search filters for tributes
8. Bulk tribute operations

## Testing

For testing API endpoints locally:
1. Ensure development environment is properly configured
2. Use the provided Postman collection (to be created)
3. Test with appropriate JWT tokens
4. Verify responses match documented formats

## Need Help?

For additional support or to report API issues:
1. Check the error response for detailed information
2. Consult the development team
3. Review WordPress plugin documentation for backend endpoints

## Last Updated: 2024-02-21
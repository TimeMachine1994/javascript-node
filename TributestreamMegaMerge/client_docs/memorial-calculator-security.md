# Memorial Calculator Security Guide

## Overview
This document outlines security measures and best practices for the Memorial Calculator system.

## Authentication & Authorization

### JWT Implementation
```typescript
// jwt-config.ts
const jwtConfig = {
  algorithm: 'HS256',
  expiresIn: '7d',
  issuer: 'tributestream.com',
  audience: 'tributestream-api',
  notBefore: Math.floor(Date.now() / 1000)
};

// JWT validation middleware
const validateJWT = async (request: Request) => {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) throw new Error('No token provided');

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: [jwtConfig.algorithm],
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience
    });
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

### Role-Based Access Control (RBAC)
```typescript
// roles.ts
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPPORT = 'support'
}

const rolePermissions = {
  [UserRole.USER]: [
    'read:own_orders',
    'create:order',
    'update:own_order'
  ],
  [UserRole.ADMIN]: [
    'read:all_orders',
    'create:order',
    'update:any_order',
    'delete:order'
  ],
  [UserRole.SUPPORT]: [
    'read:all_orders',
    'update:order_status'
  ]
};
```

## Data Protection

### Personal Information Handling
```typescript
// data-sanitization.ts
const sanitizePersonalData = (data: PersonalDetails) => {
  return {
    ...data,
    email: data.email.toLowerCase().trim(),
    phone: data.phone.replace(/[^\d+]/g, ''),
    firstName: sanitizeHtml(data.firstName),
    lastName: sanitizeHtml(data.lastName)
  };
};

// data-masking.ts
const maskSensitiveData = (data: any) => {
  const mask = (str: string) => 
    str.slice(0, 2) + '*'.repeat(str.length - 4) + str.slice(-2);

  return {
    ...data,
    email: mask(data.email),
    phone: mask(data.phone)
  };
};
```

### Payment Information Security
```typescript
// payment-security.ts
const securePaymentData = {
  tokenizeCard: async (cardData: CardDetails) => {
    // Never store raw card data
    const token = await squareClient.tokenize(cardData);
    return token;
  },
  
  processPayment: async (token: string, amount: number) => {
    // Use tokenized data only
    return await squareClient.processPayment({
      sourceId: token,
      amount,
      currency: 'USD'
    });
  }
};
```

## API Security

### Request Validation
```typescript
// validation-middleware.ts
const validateRequest = (schema: Schema) => async (request: Request) => {
  try {
    const data = await request.json();
    await schema.validate(data);
  } catch (error) {
    throw new Error(`Validation error: ${error.message}`);
  }
};

// Example schema
const orderSchema = yup.object({
  personalDetails: yup.object({
    firstName: yup.string().required().min(2),
    lastName: yup.string().required().min(2),
    email: yup.string().email().required(),
    phone: yup.string().matches(/^\+?[\d\s-()]{10,}$/)
  }),
  // ... other validations
});
```

### Rate Limiting
```typescript
// rate-limit.ts
const rateLimiter = {
  window: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  message: 'Too many requests, please try again later',
  
  async isAllowed(ip: string): Promise<boolean> {
    const count = await redis.incr(`rate_limit:${ip}`);
    if (count === 1) {
      await redis.expire(`rate_limit:${ip}`, this.window / 1000);
    }
    return count <= this.max;
  }
};
```

## Cross-Site Scripting (XSS) Protection

### Content Security Policy
```typescript
// CSP configuration
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.squareup.com'],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.tributestream.com'],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"]
  }
};
```

### Input Sanitization
```typescript
// sanitization.ts
const sanitizeInput = (input: string): string => {
  return sanitizeHtml(input, {
    allowedTags: ['b', 'i', 'em', 'strong'],
    allowedAttributes: {},
    disallowedTagsMode: 'escape'
  });
};
```

## CORS Configuration
```typescript
// cors-config.ts
const corsOptions = {
  origin: [
    'https://tributestream.com',
    'https://admin.tributestream.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With'
  ],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
```

## Error Handling

### Secure Error Responses
```typescript
// error-handler.ts
const handleError = (error: Error) => {
  // Log full error details securely
  logger.error({
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // Return sanitized error to client
  return {
    error: {
      message: 'An error occurred',
      code: error.name === 'ValidationError' ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR'
    }
  };
};
```

## Security Headers
```typescript
// security-headers.ts
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
```

## File Upload Security

### Upload Validation
```typescript
// upload-security.ts
const validateFile = async (file: File) => {
  // Check file size
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    throw new Error('File too large');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  // Scan for malware (example)
  await virusScan(file);
};
```

## Security Monitoring

### Audit Logging
```typescript
// audit-logger.ts
const auditLog = {
  async log(action: string, userId: string, details: any) {
    await db.insert('audit_logs', {
      action,
      userId,
      details,
      timestamp: new Date(),
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });
  }
};
```

### Security Events
```typescript
// security-events.ts
const securityEvents = {
  LOGIN_FAILURE: 'login_failure',
  PASSWORD_CHANGE: 'password_change',
  PERMISSION_CHANGE: 'permission_change',
  SENSITIVE_DATA_ACCESS: 'sensitive_data_access'
};

const monitorSecurityEvents = async (event: string, context: any) => {
  await auditLog.log(event, context);
  
  // Alert on suspicious activity
  if (await isAnomalous(event, context)) {
    await sendSecurityAlert(event, context);
  }
};
```

## Security Checklist

### Pre-Deployment
- [ ] All endpoints require authentication
- [ ] Input validation implemented
- [ ] XSS protection configured
- [ ] CSRF protection enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] File upload validation
- [ ] Audit logging enabled
- [ ] Error handling sanitized
- [ ] CORS properly configured

### Regular Audits
- [ ] Review authentication logs
- [ ] Check rate limit effectiveness
- [ ] Audit file uploads
- [ ] Review error logs
- [ ] Check security headers
- [ ] Test CORS configuration
- [ ] Validate input sanitization
- [ ] Review audit logs
- [ ] Check API access patterns
- [ ] Test error handling

Last Updated: 2/20/2025
# Memorial Calculator Monitoring Guide

## Overview
This document outlines the monitoring and alerting strategy for the Memorial Calculator system.

## Monitoring Components

### 1. Application Performance Monitoring (APM)

#### New Relic Configuration
```javascript
// newrelic.js
exports.config = {
  app_name: ['TributeStream Memorial Calculator'],
  license_key: 'your-license-key',
  distributed_tracing: {
    enabled: true
  },
  logging: {
    level: 'info'
  },
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 4
  },
  error_collector: {
    enabled: true,
    ignore_status_codes: [404]
  }
};
```

#### Key Metrics
1. Response Times
   - API endpoints: < 500ms
   - Page loads: < 2s
   - Payment processing: < 3s

2. Error Rates
   - API errors: < 1%
   - Payment failures: < 0.5%
   - Form validation: < 2%

3. User Experience
   - Time to interactive: < 3s
   - First contentful paint: < 1.5s
   - Largest contentful paint: < 2.5s

### 2. Error Tracking (Sentry)

#### Configuration
```javascript
// sentry.config.js
Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express()
  ],
  beforeSend(event) {
    if (event.exception) {
      Sentry.showReportDialog({ eventId: event.event_id });
    }
    return event;
  }
});
```

#### Error Categories
1. Critical Errors
   - Payment failures
   - API authentication
   - Database connectivity
   - Email sending failures

2. Warning Level
   - Form validation
   - API timeouts
   - Cache misses
   - JWT token expiration

3. Info Level
   - User actions
   - Navigation events
   - Feature usage

### 3. System Health Checks

#### Endpoint Monitoring
```typescript
// health-check.ts
async function checkSystemHealth() {
  return {
    api: await checkApiHealth(),
    database: await checkDatabaseHealth(),
    payment: await checkPaymentSystem(),
    email: await checkEmailService(),
    cache: await checkCacheHealth()
  };
}
```

#### Health Check Endpoints
1. WordPress API
   - /wp-json/wp/v2/tributes
   - /wp-json/jwt-auth/v1/token/validate

2. Payment System
   - Square API status
   - Webhook delivery

3. Email Service
   - SendGrid API status
   - Template availability

### 4. Business Metrics

#### Key Performance Indicators (KPIs)
1. Conversion Rates
   - Calculator to checkout
   - Checkout to payment
   - Payment to confirmation

2. Usage Metrics
   - Active users
   - Orders per day
   - Average order value
   - Package distribution

3. Error Metrics
   - Form abandonment
   - Payment failures
   - API errors

## Alerting Configuration

### 1. Critical Alerts

#### Payment Processing
```yaml
# alert-rules.yml
- alert: PaymentProcessingFailure
  expr: rate(payment_failures_total[5m]) > 0.05
  for: 2m
  labels:
    severity: critical
  annotations:
    summary: High payment failure rate
    description: Payment failure rate exceeds 5% over 5 minutes
```

#### API Availability
```yaml
- alert: ApiUnavailable
  expr: probe_success{job="wordpress-api"} == 0
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: WordPress API is down
    description: API endpoint is not responding
```

#### Email Delivery
```yaml
- alert: EmailDeliveryFailure
  expr: rate(email_failures_total[5m]) > 0.1
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: High email failure rate
    description: Email failure rate exceeds 10% over 5 minutes
```

### 2. Warning Alerts

#### Performance Degradation
```yaml
- alert: HighResponseTime
  expr: http_request_duration_seconds{quantile="0.95"} > 2
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: High response times
    description: 95th percentile of response times exceeds 2 seconds
```

#### Error Rate Increase
```yaml
- alert: IncreasedErrorRate
  expr: rate(http_errors_total[5m]) > 0.02
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: Increased error rate
    description: Error rate exceeds 2% over 5 minutes
```

### 3. Info Alerts

#### Usage Patterns
```yaml
- alert: UnusualTrafficPattern
  expr: rate(http_requests_total[5m]) > hist_avg + 2*hist_stddev
  for: 10m
  labels:
    severity: info
  annotations:
    summary: Unusual traffic pattern
    description: Request rate significantly above historical average
```

## Dashboard Configuration

### 1. Operations Dashboard
- System health status
- Error rates and trends
- Response time metrics
- Active users

### 2. Business Dashboard
- Conversion metrics
- Revenue tracking
- Package distribution
- Geographic distribution

### 3. Development Dashboard
- Deploy status
- Build metrics
- Test coverage
- Code quality

## Incident Response

### 1. Severity Levels
1. SEV1: Critical business impact
2. SEV2: Significant degradation
3. SEV3: Minor impact
4. SEV4: No immediate impact

### 2. Response Procedures
1. Immediate Actions
   - Assess impact
   - Notify stakeholders
   - Begin mitigation

2. Communication
   - Status updates
   - Customer notification
   - Team coordination

3. Resolution
   - Root cause analysis
   - Corrective action
   - Documentation

## Maintenance Procedures

### 1. Regular Checks
- Daily health checks
- Weekly performance review
- Monthly capacity planning

### 2. Preventive Maintenance
- Log rotation
- Database optimization
- Cache clearing
- SSL certificate renewal

### 3. Documentation
- Incident reports
- Performance trends
- Capacity planning
- Security audits

Last Updated: 2/20/2025
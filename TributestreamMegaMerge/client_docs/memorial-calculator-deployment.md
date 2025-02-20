# Memorial Calculator Deployment Guide

## Overview
This guide outlines the deployment process for the Memorial Calculator, Checkout System, and Order Management components.

## Prerequisites

### Environment Requirements
1. Node.js 18+
2. WordPress 6.0+
3. MySQL 8.0+
4. Vercel account
5. Square account for payments

### Required API Keys
```env
# WordPress
VITE_WP_API_URL=https://your-wordpress-site.com/wp-json
VITE_WP_JWT_AUTH_SECRET=your-jwt-secret

# Square Payments
VITE_SQUARE_APP_ID=your-square-app-id
VITE_SQUARE_LOCATION_ID=your-square-location-id

# Email Service
VITE_SENDGRID_API_KEY=your-sendgrid-key
VITE_EMAIL_FROM=noreply@tributestream.com
```

## Deployment Steps

### 1. WordPress Setup

#### Install Required Plugins
1. JWT Authentication Plugin
```bash
wp plugin install jwt-authentication-for-wp-rest-api --activate
```

2. Custom Tributes Plugin
```bash
cd wp-content/plugins
git clone https://github.com/your-org/tribute-stream-wp-plugin.git
wp plugin activate tribute-stream
```

#### Configure JWT Authentication
1. Add to wp-config.php:
```php
define('JWT_AUTH_SECRET_KEY', 'your-secret-key');
define('JWT_AUTH_CORS_ENABLE', true);
```

2. Update .htaccess:
```apache
RewriteEngine on
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
```

### 2. Frontend Deployment

#### Development Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

#### Production Deployment (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

```bash
# Manual deployment
vercel --prod
```

### 3. Database Setup

#### Create Required Tables
```sql
-- Tributes Table
CREATE TABLE wp_tributes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    status VARCHAR(20) DEFAULT 'pending',
    author BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY author_idx (author),
    KEY status_idx (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tribute Meta Table
CREATE TABLE wp_tribute_meta (
    meta_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tribute_id BIGINT UNSIGNED NOT NULL,
    meta_key VARCHAR(255) NOT NULL,
    meta_value LONGTEXT,
    PRIMARY KEY (meta_id),
    KEY tribute_id_idx (tribute_id),
    KEY meta_key_idx (meta_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 4. Email Setup

#### SendGrid Configuration
1. Create SendGrid account
2. Set up domain authentication
3. Create API key
4. Configure email templates:
   - memorial-service-confirmation
   - payment-confirmation
   - service-reminder

### 5. Payment Setup

#### Square Configuration
1. Create Square developer account
2. Create application
3. Configure webhook endpoints
4. Set up sandbox testing

## Post-Deployment Verification

### 1. System Health Checks
```bash
# Check WordPress API
curl -I https://your-wordpress-site.com/wp-json/wp/v2/tributes

# Verify JWT auth
curl -H "Authorization: Bearer your-token" https://your-wordpress-site.com/wp-json/jwt-auth/v1/token/validate
```

### 2. Frontend Verification
- Test calculator functionality
- Verify checkout process
- Check order management
- Test email notifications

### 3. Security Verification
- SSL certificate validation
- CORS configuration
- API authentication
- Payment security

## Monitoring Setup

### 1. Error Tracking
- Set up Sentry.io
- Configure error notifications
- Set up error thresholds

### 2. Performance Monitoring
- Configure New Relic
- Set up performance alerts
- Monitor API response times

### 3. Usage Analytics
- Set up Google Analytics
- Configure conversion tracking
- Monitor user flows

## Backup Procedures

### 1. Database Backups
```bash
# Daily backups
mysqldump -u user -p database_name > backup.sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
mysqldump -u user -p database_name > backup_$DATE.sql
gzip backup_$DATE.sql
```

### 2. Code Backups
- GitHub repository backups
- WordPress files backup
- Environment configuration backup

## Rollback Procedures

### 1. Code Rollback
```bash
# Vercel rollback
vercel rollback

# WordPress plugin rollback
wp plugin update tribute-stream --version=previous-version
```

### 2. Database Rollback
```sql
-- Restore from backup
mysql -u user -p database_name < backup.sql
```

## Troubleshooting

### Common Issues

1. JWT Authentication
```bash
# Clear token cache
wp cache flush

# Verify JWT secret
wp config get JWT_AUTH_SECRET_KEY
```

2. Payment Processing
- Check Square dashboard for transaction status
- Verify webhook delivery
- Check payment logs

3. Email Delivery
- Check SendGrid activity logs
- Verify email templates
- Check spam scores

## Support Contacts

### Technical Support
- Frontend: frontend@tributestream.com
- WordPress: wp-support@tributestream.com
- Payments: payments@tributestream.com

### Emergency Contacts
- On-call Engineer: +1-800-TRIBUTE-911
- System Administrator: admin@tributestream.com

Last Updated: 2/20/2025
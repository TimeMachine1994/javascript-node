# TributeStream Deployment Guide

## Overview

TributeStream uses a dual deployment strategy:
1. Frontend (SvelteKit) deployed on Vercel
2. WordPress backend on a private server

This guide covers both deployment processes and their maintenance.

## Frontend Deployment (Vercel)

### Initial Setup

1. **Vercel Project Configuration**
   - Connect GitHub repository to Vercel
   - Configure project settings:
     ```
     Framework Preset: SvelteKit
     Build Command: npm run build
     Output Directory: .svelte-kit
     Install Command: npm install
     ```

2. **Environment Variables**
   Set the following in Vercel project settings:
   ```
   WORDPRESS_API_URL=https://your-wordpress-backend.com
   JWT_SECRET=your_jwt_secret
   PUBLIC_SITE_URL=https://your-production-domain.com
   ```

### Deployment Process

1. **Automatic Deployments**
   - Push to `main` branch triggers production deployment
   - All pull requests get preview deployments

2. **Manual Deployment**
   ```bash
   # If needed, deploy from local
   vercel
   
   # Deploy to production
   vercel --prod
   ```

3. **Post-Deployment Verification**
   - Check build logs in Vercel dashboard
   - Verify environment variables
   - Test critical functionality:
     - Authentication
     - API endpoints
     - Media embedding
     - Forms

### Monitoring

1. **Vercel Dashboard**
   - Monitor build status
   - Check deployment logs
   - Review performance metrics

2. **Error Tracking**
   - Review console errors
   - Monitor API responses
   - Check build warnings

## WordPress Backend Deployment

### Server Requirements

- PHP 7.4+
- MySQL 5.7+
- HTTPS enabled
- Sufficient storage for media files

### Initial Setup

1. **WordPress Installation**
   - Install WordPress core
   - Configure database
   - Set up SSL certificate
   - Install required plugins:
     - JWT Authentication
     - Custom REST API plugin
     - Required media plugins

2. **Security Configuration**
   ```apache
   # Example Apache configuration
   <Directory /var/www/html>
       AllowOverride All
       Require all granted
   </Directory>
   ```

3. **Plugin Configuration**
   - Configure JWT Authentication
   - Set up CORS headers
   - Configure media handling

### Database Management

1. **Backup Strategy**
   ```bash
   # Example backup command
   mysqldump -u [user] -p [database] > backup.sql
   ```

2. **Restore Process**
   ```bash
   # Example restore command
   mysql -u [user] -p [database] < backup.sql
   ```

### Media Storage

1. **Configuration**
   - Set up media directory permissions
   - Configure upload limits
   - Set up backup system for media files

2. **Maintenance**
   ```bash
   # Example media backup
   rsync -av /var/www/html/wp-content/uploads/ /backup/media/
   ```

## Deployment Checklist

### Pre-Deployment
- [ ] All changes committed and pushed
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] Media files backed up
- [ ] Test suite passed (when implemented)

### Post-Deployment
- [ ] Verify frontend builds successfully
- [ ] Check all API endpoints
- [ ] Test authentication flow
- [ ] Verify media uploads and embedding
- [ ] Check form submissions
- [ ] Monitor error logs

## Rollback Procedures

### Frontend Rollback
1. Access Vercel dashboard
2. Select previous successful deployment
3. Click "Promote to Production"

### Backend Rollback
1. Restore database backup
2. Restore media files
3. Revert WordPress plugins if needed

## Maintenance Tasks

### Regular Maintenance
- Monitor disk space
- Review error logs
- Update WordPress core and plugins
- Rotate database backups
- Clean up old media files

### Performance Optimization
- Review Vercel analytics
- Monitor WordPress performance
- Optimize database queries
- Clean up unused media

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel
   - Verify dependencies
   - Check environment variables

2. **API Connection Issues**
   - Verify WordPress is accessible
   - Check CORS configuration
   - Verify SSL certificates

3. **Media Problems**
   - Check storage space
   - Verify permissions
   - Check upload configurations

## Security Considerations

### Frontend
- Keep dependencies updated
- Review Vercel security settings
- Monitor access logs

### Backend
- Regular WordPress updates
- Security plugin maintenance
- Database access restrictions
- File permissions audit

## Emergency Contacts

Maintain a list of key personnel:
- Frontend deployment manager
- Backend system administrator
- Database administrator
- Security team contact

## Future Improvements

Planned deployment improvements:
1. Automated testing integration
2. Enhanced monitoring
3. Automated backup verification
4. Performance optimization tools
5. Staging environment setup

## Documentation Updates

Keep this deployment guide updated:
- Document new deployment procedures
- Update environment variables
- Maintain troubleshooting guides
- Record successful rollback procedures
# OutfitCreator Frontend - Deployment Guide

## Overview

This document provides instructions for building and deploying the OutfitCreator frontend application to production.

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Access to the production backend API
- Static hosting service (e.g., Netlify, Vercel, AWS S3 + CloudFront, Nginx)

## Environment Variables

The application requires the following environment variables to be configured:

### Development (.env.development)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_MAX_FILE_SIZE=5242880
VITE_SUPPORTED_IMAGE_TYPES=image/jpeg,image/png,image/gif
```

### Production (.env.production)

```env
VITE_API_BASE_URL=https://api.outfitcreator.com
VITE_MAX_FILE_SIZE=5242880
VITE_SUPPORTED_IMAGE_TYPES=image/jpeg,image/png,image/gif
```

**Important:** Update `VITE_API_BASE_URL` to point to your production backend API URL.

## Build Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Tests (Optional but Recommended)

```bash
npm run test
```

### 3. Build for Production

```bash
npm run build
```

This command:
- Compiles TypeScript to JavaScript
- Bundles and minifies all assets
- Optimizes images and fonts
- Generates source maps for debugging
- Creates code-split chunks for better performance
- Outputs to the `dist/` directory

### 4. Preview Production Build Locally

```bash
npm run preview
```

This starts a local server to test the production build before deployment.

## Build Output

The production build creates the following structure in the `dist/` directory:

```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-[hash].js     # Main application bundle
│   ├── index-[hash].css    # Compiled styles
│   ├── react-vendor-[hash].js    # React libraries chunk
│   └── form-vendor-[hash].js     # Form libraries chunk
└── vite.svg                # Favicon
```

## Bundle Size Optimization

The build is configured with the following optimizations:

- **Code Splitting**: Routes are lazy-loaded to reduce initial bundle size
- **Vendor Chunks**: React and form libraries are separated into dedicated chunks
- **Tree Shaking**: Unused code is automatically removed
- **Minification**: JavaScript and CSS are minified
- **Compression**: Enable gzip/brotli compression on your hosting service

### Expected Bundle Sizes

- Main bundle: ~50-100 KB (gzipped)
- React vendor chunk: ~130-150 KB (gzipped)
- Form vendor chunk: ~20-30 KB (gzipped)
- Total initial load: ~200-280 KB (gzipped)

## Deployment Options

### Option 1: Static Hosting (Netlify, Vercel)

1. Connect your Git repository
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set environment variables in the hosting dashboard
4. Deploy

### Option 2: AWS S3 + CloudFront

1. Build the application locally
2. Upload `dist/` contents to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain and SSL certificate
5. Configure cache headers for optimal performance

### Option 3: Nginx

1. Build the application
2. Copy `dist/` contents to Nginx web root (e.g., `/var/www/html`)
3. Configure Nginx with the following settings:

```nginx
server {
    listen 80;
    server_name outfitcreator.com;
    root /var/www/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## Backend CORS Configuration

Ensure your backend API is configured to accept requests from your frontend domain:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("https://outfitcreator.com")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## Browser Requirements

The application supports the following browsers:

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- iOS Safari: Last 2 versions
- Android Chrome: Last 2 versions

**Minimum Requirements:**
- ES6 support
- CSS Grid and Flexbox support
- LocalStorage API
- Fetch API

## Performance Checklist

Before deploying to production, verify:

- [ ] All environment variables are correctly set
- [ ] API URL points to production backend
- [ ] HTTPS is enforced for all API calls
- [ ] Source maps are generated for debugging
- [ ] Gzip/Brotli compression is enabled
- [ ] Cache headers are configured for static assets
- [ ] CDN is configured (if applicable)
- [ ] Error tracking is set up (e.g., Sentry)
- [ ] Analytics are configured (if applicable)

## Security Checklist

- [ ] Content Security Policy (CSP) is configured
- [ ] HTTPS is enforced
- [ ] Secure token handling is implemented
- [ ] Input sanitization is in place
- [ ] CORS is properly configured on backend
- [ ] No sensitive data in client-side code
- [ ] Dependencies are up to date and audited

## Monitoring and Debugging

### Source Maps

Source maps are generated in production builds to help with debugging. They map minified code back to the original source code.

**Important:** Consider restricting access to source maps in production or uploading them to an error tracking service like Sentry.

### Error Tracking

Consider integrating an error tracking service:

1. **Sentry**: Real-time error tracking and monitoring
2. **LogRocket**: Session replay and error tracking
3. **Rollbar**: Error monitoring and alerting

### Performance Monitoring

Monitor application performance with:

1. **Google Analytics**: User behavior and page views
2. **Web Vitals**: Core Web Vitals metrics
3. **Lighthouse**: Performance audits

## Rollback Procedure

If issues are discovered after deployment:

1. Revert to the previous Git commit
2. Rebuild the application
3. Redeploy to hosting service
4. Verify the rollback was successful

## Support

For deployment issues or questions:

- Check the [README.md](./README.md) for general information
- Review the [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for architecture details
- Contact the development team

## Changelog

Keep track of deployment versions and changes:

- **v1.0.0** (YYYY-MM-DD): Initial production release
  - Core features: Authentication, Closet, Outfits, Recommendations
  - Responsive design and accessibility
  - Performance optimizations
  - Security hardening

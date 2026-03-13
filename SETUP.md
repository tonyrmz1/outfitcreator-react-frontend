# Frontend Setup Instructions

## Initial Setup

The frontend project structure has been created with all necessary configuration files.

### Fix npm Cache Issue (if needed)

If you encounter npm cache permission errors, run:

```bash
sudo chown -R $(whoami) ~/.npm
```

Then clean the cache:

```bash
npm cache clean --force
```

### Install Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

### Verify Installation

After installation completes, verify the setup:

```bash
npm run lint
```

### Start Development Server

```bash
npm run dev
```

The application should be available at http://localhost:3000

## What's Been Set Up

✅ Vite + React + TypeScript project structure
✅ Tailwind CSS configuration
✅ ESLint and Prettier configuration
✅ Environment variables (.env files)
✅ Vite proxy configuration for API (proxies /api to http://localhost:8080)
✅ Project directory structure:
  - src/api - API client layer
  - src/components - Reusable UI components
  - src/hooks - Custom React hooks
  - src/pages - Page components
  - src/types - TypeScript type definitions
  - src/utils - Utility functions and validation schemas
  - src/test - Test setup
✅ Core dependencies configured:
  - react-router-dom for routing
  - axios for HTTP requests
  - zod for validation
  - react-hook-form for forms
  - react-dropzone for file uploads
  - vitest + @testing-library/react for testing
  - fast-check for property-based testing

## Next Steps

After dependencies are installed, you can:

1. Start the development server: `npm run dev`
2. Run tests: `npm test`
3. Run linting: `npm run lint`
4. Format code: `npm run format`

## Troubleshooting

### Node Version Issues

If you encounter issues with Vite or other packages, ensure you're using Node.js 18 or higher:

```bash
node --version
```

### Port Already in Use

If port 3000 is already in use, you can change it in `vite.config.ts`:

```typescript
server: {
  port: 3001, // Change to any available port
  // ...
}
```

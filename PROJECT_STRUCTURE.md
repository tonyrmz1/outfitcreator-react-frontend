# Frontend Project Structure

## Overview

This document describes the complete frontend project structure for the OutfitCreator application.

## Directory Structure

```
frontend/
├── src/
│   ├── api/                    # API client and service layer
│   │   ├── client.ts          # Axios client with interceptors
│   │   └── index.ts           # API exports
│   │
│   ├── components/            # Reusable UI components
│   │   └── index.ts          # Component exports (placeholder)
│   │
│   ├── hooks/                 # Custom React hooks
│   │   └── index.ts          # Hook exports (placeholder)
│   │
│   ├── pages/                 # Page components
│   │   └── index.ts          # Page exports (placeholder)
│   │
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts          # All type definitions and enums
│   │
│   ├── utils/                 # Utility functions
│   │   ├── validation.ts     # Zod validation schemas
│   │   └── index.ts          # Utility exports
│   │
│   ├── test/                  # Test setup and utilities
│   │   └── setup.ts          # Vitest setup file
│   │
│   ├── App.tsx               # Root application component
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Global styles with Tailwind
│   └── vite-env.d.ts         # Vite environment type definitions
│
├── public/                    # Static assets (to be added)
│
├── .env.development          # Development environment variables
├── .env.production           # Production environment variables
├── .eslintrc.cjs             # ESLint configuration
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier configuration
├── index.html                # HTML entry point
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── README.md                 # Project documentation
├── SETUP.md                  # Setup instructions
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # TypeScript config for Node files
├── vite.config.ts            # Vite build configuration
└── vitest.config.ts          # Vitest test configuration
```

## Configuration Files

### package.json
- Defines all project dependencies
- Includes scripts for dev, build, test, lint, and format
- Core dependencies: React, React Router, Axios, Zod, React Hook Form, React Dropzone
- Dev dependencies: TypeScript, Vite, Vitest, ESLint, Prettier, Tailwind CSS, Testing Library

### vite.config.ts
- Vite build tool configuration
- Dev server on port 3000
- API proxy: `/api` → `http://localhost:8080`
- Code splitting for vendor libraries

### tsconfig.json
- TypeScript strict mode enabled
- ES2020 target
- React JSX support
- Bundler module resolution

### tailwind.config.js
- Tailwind CSS configuration
- Custom color palette (primary colors)
- Content paths for purging unused styles

### .eslintrc.cjs
- ESLint rules for TypeScript and React
- React Hooks plugin
- Unused variables and parameters detection

### .prettierrc
- Code formatting rules
- Single quotes, 2-space indentation
- 100 character line width

### vitest.config.ts
- Vitest test runner configuration
- jsdom environment for React testing
- Coverage reporting with v8

## Environment Variables

### Development (.env.development)
- `VITE_API_BASE_URL=http://localhost:8080`
- `VITE_MAX_FILE_SIZE=5242880` (5MB)
- `VITE_SUPPORTED_IMAGE_TYPES=image/jpeg,image/png,image/gif`

### Production (.env.production)
- `VITE_API_BASE_URL=/api`
- Same file size and type restrictions

## Type Definitions (src/types/index.ts)

### Enums
- `ClothingCategory`: TOP, BOTTOM, FOOTWEAR, OUTERWEAR, ACCESSORIES
- `Season`: SPRING, SUMMER, AUTUMN, WINTER, ALL_SEASON
- `FitCategory`: TIGHT, REGULAR, LOOSE, OVERSIZED
- `ItemPosition`: TOP, BOTTOM, FOOTWEAR, OUTERWEAR, ACCESSORY

### Interfaces
- `User`: User account information
- `ClothingItem`: Clothing item with all attributes
- `Outfit`: Outfit with items and positions
- `OutfitItem`: Item within an outfit
- `OutfitRecommendation`: AI recommendation with scores
- `PaginatedResponse<T>`: Paginated API response
- `ErrorResponse`: API error response
- `LoginRequest/Response`: Authentication types
- `RegisterRequest`: Registration data
- Form data types for all entities

## API Client (src/api/client.ts)

### Features
- Axios instance with base URL from environment
- Request interceptor: Adds JWT token to Authorization header
- Response interceptor: Handles 401 errors (auto-logout)
- Methods: get, post, put, delete, postFormData
- Singleton instance exported

## Validation Schemas (src/utils/validation.ts)

### Zod Schemas
- `loginSchema`: Email and password validation
- `registerSchema`: Registration with password strength rules
- `clothingItemSchema`: Clothing item field validation
- `outfitSchema`: Outfit with items validation
- `photoSchema`: File type and size validation

## Scripts

### Development
- `npm run dev`: Start dev server on port 3000
- `npm run build`: Build for production
- `npm run preview`: Preview production build

### Testing
- `npm test`: Run tests once
- `npm run test:watch`: Run tests in watch mode
- `npm run test:ui`: Run tests with UI
- `npm run test:coverage`: Run tests with coverage report

### Code Quality
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Next Steps

After running `npm install`, the following components need to be implemented:

1. **Pages**: Login, Register, Closet, Outfits, Recommendations, Profile
2. **Components**: Navigation, Modal, Button, Input, Select, Cards, Forms
3. **Hooks**: useAuth, useClothingItems, useOutfits, useRecommendations
4. **API Services**: Auth API, Clothing Items API, Outfits API, Recommendations API

## Requirements Addressed

This setup addresses the following requirements from the spec:

- **Requirement 26**: Environment Configuration ✅
- **Requirement 27**: Build and Deployment ✅
- **Requirement 28**: Type Safety ✅
- **Requirement 30**: Code Quality Standards ✅

The project structure provides a solid foundation for implementing all remaining requirements.

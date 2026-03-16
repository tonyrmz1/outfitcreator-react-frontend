# Project Refactoring Plan

## Overview
Restructure the React frontend project for better organization, maintainability, and scalability.

## Current Issues
1. Components folder is too flat (50+ files in one directory)
2. Test files mixed with source files
3. Hooks not organized by domain
4. No constants folder for app-wide values
5. API layer could be better organized

## New Structure

```
src/
├── config/                 # Configuration files
├── constants/              # App-wide constants
├── types/                  # TypeScript types
├── schemas/                # Validation schemas
├── api/                    # API client & endpoints
│   ├── client.ts
│   ├── endpoints/
│   │   ├── auth.ts
│   │   ├── clothing.ts
│   │   ├── outfits.ts
│   │   └── recommendations.ts
│   ├── interceptors/
│   └── __tests__/
├── utils/                  # Utility functions
├── hooks/                  # Custom hooks (organized by domain)
│   ├── auth/
│   ├── data/
│   ├── ui/
│   ├── theme/
│   └── __tests__/
├── contexts/               # React contexts
├── components/             # Components (organized by type/domain)
│   ├── common/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Pagination/
│   │   ├── LoadingSpinner/
│   │   ├── Select/
│   │   └── Toast/
│   ├── layout/
│   │   ├── MainLayout/
│   │   ├── Navigation/
│   │   └── ErrorBoundary/
│   ├── features/
│   │   ├── Closet/
│   │   ├── Outfits/
│   │   ├── Recommendations/
│   │   └── Theme/
│   └── __tests__/
├── pages/                  # Page components
├── test/                   # Test utilities & setup
├── App.tsx
├── main.tsx
└── index.css
```

## Execution Steps

### Phase 1: Create New Folder Structure
- [ ] Create config/ folder
- [ ] Create constants/ folder
- [ ] Reorganize components/ into common/, layout/, features/
- [ ] Reorganize hooks/ by domain (auth/, data/, ui/, theme/)
- [ ] Reorganize api/ with endpoints/ subfolder
- [ ] Create test/ utilities folder

### Phase 2: Move and Update Files
- [ ] Move component files to new locations
- [ ] Move test files to __tests__/ folders
- [ ] Move hooks to domain folders
- [ ] Move API endpoints to endpoints/ folder
- [ ] Create constants files

### Phase 3: Update Imports
- [ ] Update all import statements in components
- [ ] Update all import statements in pages
- [ ] Update all import statements in hooks
- [ ] Update all import statements in contexts
- [ ] Update index.ts files for barrel exports

### Phase 4: Verify & Test
- [ ] Run type checking (tsc)
- [ ] Run linter (eslint)
- [ ] Run tests (vitest)
- [ ] Verify no broken imports

## Timeline
- Phase 1: 15 minutes
- Phase 2: 30 minutes
- Phase 3: 45 minutes
- Phase 4: 15 minutes
- **Total: ~2 hours**

## Rollback Plan
All changes are file moves and import updates. Git history will preserve original structure if needed.

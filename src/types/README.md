# Type Definitions

This directory contains all TypeScript type definitions for the OutfitCreator frontend application.

## Overview

The type definitions are organized in a single `index.ts` file that serves as the central export point for all types used throughout the application. This ensures consistency and makes imports simple.

## Type Categories

### User Types
- `User` - Represents an authenticated user with profile information

### Clothing Item Types
- `ClothingItem` - Complete clothing item with all attributes
- `ClothingItemFormData` - Form data for creating/editing items
- `ClothingItemFilters` - Filter criteria for searching items

### Outfit Types
- `Outfit` - Complete outfit with items and metadata
- `OutfitItem` - Individual item within an outfit with position
- `OutfitFormData` - Form data for creating/editing outfits
- `OutfitItemSelection` - Item selection for outfit builder

### Recommendation Types
- `OutfitRecommendation` - AI-generated outfit suggestion with scores
- `RecommendationFilters` - Filter criteria for recommendations

### Enums
- `ClothingCategory` - TOP, BOTTOM, FOOTWEAR, OUTERWEAR, ACCESSORIES
- `Season` - SPRING, SUMMER, AUTUMN, WINTER, ALL_SEASON
- `FitCategory` - TIGHT, REGULAR, LOOSE, OVERSIZED
- `ItemPosition` - TOP, BOTTOM, FOOTWEAR, OUTERWEAR, ACCESSORY

### API Response Types
- `ApiResponse<T>` - Generic API response wrapper
- `PaginatedResponse<T>` - Paginated list response
- `ErrorResponse` - Error response with details

### Authentication Types
- `LoginRequest` - Login credentials
- `LoginResponse` - Login response with token and user
- `RegisterRequest` - Registration data
- `LoginFormData` - Login form data
- `RegisterFormData` - Registration form data with confirmation
- `ProfileFormData` - Profile update form data

### Utility Types
- `PaginationState` - Pagination state management
- `ValidationResult` - Form validation result
- `SelectOption` - Dropdown option

## Usage

Import types from the central index file:

```typescript
import { 
  User, 
  ClothingItem, 
  ClothingCategory,
  Season 
} from '@/types';
```

Or with relative imports:

```typescript
import { 
  User, 
  ClothingItem, 
  ClothingCategory,
  Season 
} from '../types';
```

## Type Safety

All types are designed to match the backend API contracts exactly, ensuring type safety across the full stack. The types are used in conjunction with Zod schemas for runtime validation.

## Testing

Type definitions are tested in `types.test.ts` to ensure:
- All types are properly exported
- Types can be instantiated correctly
- Enum values are correct
- Type relationships work as expected

## Alignment with Backend

These types align with the Java backend models:
- Enums use string values matching backend enum names
- Field names match backend JSON serialization
- Optional fields match backend nullable fields
- Date fields use ISO 8601 string format

## Requirements Coverage

This implementation satisfies **Requirement 28: Type Safety**:
- ✅ TypeScript strict mode enabled
- ✅ Interfaces for all data models (User, ClothingItem, Outfit, Recommendation)
- ✅ Interfaces for all API request and response types
- ✅ Interfaces for component props (SelectOption, ValidationResult)
- ✅ Zod schemas align with TypeScript types (in utils/validation.ts)

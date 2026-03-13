# Validation Schemas

This directory contains Zod validation schemas for runtime type checking and form validation.

## Schemas

### Authentication Schemas (`auth.schemas.ts`)

- **loginSchema**: Validates login credentials (email and password)
- **registerSchema**: Validates registration data with password strength requirements
- **profileSchema**: Validates profile update data

### Clothing Schemas (`clothing.schemas.ts`)

- **clothingItemSchema**: Validates clothing item data with field constraints
  - Name: 1-255 characters (required)
  - Brand: max 100 characters (optional)
  - Primary color: required
  - Category: must be valid ClothingCategory enum
  - Notes: max 1000 characters (optional)

### Outfit Schemas (`outfit.schemas.ts`)

- **outfitSchema**: Validates outfit data
  - Name: 1-255 characters (required)
  - Notes: max 1000 characters (optional)
  - Items: at least one item required

### Photo Schemas (`photo.schemas.ts`)

- **photoSchema**: Validates photo file uploads
  - File type: JPEG, PNG, or GIF only
  - File size: max 5MB
- **validatePhotoFile**: Helper function for photo validation

## Usage

```typescript
import { loginSchema, clothingItemSchema } from '@/schemas';

// Validate data
const result = loginSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.errors);
}

// Use with React Hook Form
import { zodResolver } from '@hookform/resolvers/zod';
const { register, handleSubmit } = useForm({
  resolver: zodResolver(loginSchema),
});
```

## Requirements

These schemas implement validation requirements from:
- Requirement 12: Form Validation
- Requirement 28: Type Safety

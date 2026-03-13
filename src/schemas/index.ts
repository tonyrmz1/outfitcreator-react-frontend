/**
 * Central export for all Zod validation schemas
 * Requirements: 12, 28
 */

// Auth schemas
export { loginSchema, registerSchema, profileSchema } from './auth.schemas';

// Clothing schemas
export { clothingItemSchema } from './clothing.schemas';

// Outfit schemas
export { outfitSchema } from './outfit.schemas';

// Photo schemas
export { photoSchema, validatePhotoFile } from './photo.schemas';

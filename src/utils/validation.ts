import { z } from 'zod';
import { ClothingCategory, Season, FitCategory, ItemPosition } from '../types';

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Registration validation
export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Clothing item validation
export const clothingItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  brand: z.string().max(100).optional().or(z.literal('')).nullable(),
  primaryColor: z.string().min(1, 'Primary color is required'),
  secondaryColor: z.string().optional().or(z.literal('')).nullable(),
  category: z.nativeEnum(ClothingCategory),
  size: z.string().optional().or(z.literal('')).nullable(),
  season: z.nativeEnum(Season).optional().nullable(),
  fitCategory: z.nativeEnum(FitCategory).optional().nullable(),
  purchaseDate: z.string().optional().or(z.literal('')).nullable(),
});

// Outfit validation
export const outfitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  notes: z.string().max(1000).optional(),
  items: z
    .array(
      z.object({
        clothingItemId: z.number(),
        position: z.nativeEnum(ItemPosition),
      })
    )
    .min(1, 'At least one item is required'),
});

// Photo validation
export const photoSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
      'Only JPEG, PNG, and GIF files are supported'
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ClothingItemFormData = z.infer<typeof clothingItemSchema>;
export type OutfitFormData = z.infer<typeof outfitSchema>;

/**
 * Validates an outfit before submission to the API
 * 
 * Checks:
 * - Name is present and not empty
 * - At least one item is included
 * - Each position (TOP, BOTTOM, FOOTWEAR, OUTERWEAR, ACCESSORY) appears at most once
 * - Notes length doesn't exceed 1000 characters
 * 
 * @param outfit - The outfit data to validate
 * @returns ValidationResult with isValid boolean and errors array
 */
export function validateOutfit(outfit: OutfitFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate name
  if (!outfit.name || outfit.name.trim().length === 0) {
    errors.push('Outfit name is required');
  }

  if (outfit.name && outfit.name.length > 255) {
    errors.push('Outfit name must not exceed 255 characters');
  }

  // Validate items
  if (!outfit.items || outfit.items.length === 0) {
    errors.push('At least one clothing item is required');
  }

  // Check for duplicate positions
  if (outfit.items && outfit.items.length > 0) {
    const positions = outfit.items.map((item) => item.position);
    const uniquePositions = new Set(positions);
    if (positions.length !== uniquePositions.size) {
      errors.push('Each position can only have one item');
    }
  }

  // Validate notes length
  if (outfit.notes && outfit.notes.length > 1000) {
    errors.push('Notes must not exceed 1000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

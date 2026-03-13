import { z } from 'zod';
import { ClothingCategory, Season, FitCategory } from '../types';

/**
 * Clothing item validation schema
 * Enforces field constraints for name, brand, colors, and notes
 * Requirements: 12, 28
 */
export const clothingItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must not exceed 255 characters'),
  brand: z
    .string()
    .max(100, 'Brand must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  primaryColor: z.string().min(1, 'Primary color is required'),
  secondaryColor: z.string().optional().or(z.literal('')),
  category: z.nativeEnum(ClothingCategory, {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  size: z.string().optional().or(z.literal('')),
  season: z
    .nativeEnum(Season, {
      errorMap: () => ({ message: 'Invalid season' }),
    })
    .optional(),
  fitCategory: z
    .nativeEnum(FitCategory, {
      errorMap: () => ({ message: 'Invalid fit category' }),
    })
    .optional(),
  purchaseDate: z.string().optional().or(z.literal('')),
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
});

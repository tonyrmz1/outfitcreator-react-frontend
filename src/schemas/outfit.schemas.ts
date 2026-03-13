import { z } from 'zod';
import { ItemPosition } from '../types';

/**
 * Outfit validation schema
 * Validates outfit name and ensures at least one item is included
 * Requirements: 12, 28
 */
export const outfitSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must not exceed 255 characters'),
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  items: z
    .array(
      z.object({
        clothingItemId: z.number().positive('Invalid clothing item ID'),
        position: z.nativeEnum(ItemPosition, {
          errorMap: () => ({ message: 'Invalid position' }),
        }),
      })
    )
    .min(1, 'At least one item is required'),
});

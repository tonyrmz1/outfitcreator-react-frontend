import { z } from 'zod';

/**
 * Photo file validation schema
 * Validates file type (JPEG, PNG, GIF) and size (max 5MB)
 * Requirements: 12, 28
 */
export const photoSchema = z.object({
  file: z
    .instanceof(File, { message: 'File is required' })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB',
    })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
      {
        message: 'Only JPEG, PNG, and GIF files are supported',
      }
    ),
});

/**
 * Helper function to validate a photo file
 * @param file - The file to validate
 * @returns Validation result with success status and optional error
 */
export function validatePhotoFile(file: File): {
  success: boolean;
  error?: string;
} {
  const result = photoSchema.safeParse({ file });
  if (result.success) {
    return { success: true };
  }
  return {
    success: false,
    error: result.error.errors[0]?.message || 'Invalid file',
  };
}

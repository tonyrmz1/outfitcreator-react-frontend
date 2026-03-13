/**
 * Photo upload utility functions for clothing items
 * 
 * Provides validation and preview URL generation for photo uploads.
 * Validates file type (JPEG, PNG, GIF) and size (5MB max).
 */

export interface PhotoValidationResult {
  isValid: boolean;
  error?: string;
  previewUrl?: string;
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Validates and prepares a photo file for upload
 * 
 * Validates:
 * - File type must be JPEG, PNG, or GIF
 * - File size must not exceed 5MB
 * 
 * If valid, creates a preview URL using URL.createObjectURL
 * 
 * @param file - The file to validate and prepare
 * @returns PhotoValidationResult with validation status, error message if invalid, and preview URL if valid
 * 
 * @example
 * const result = handlePhotoUpload(file);
 * if (result.isValid) {
 *   console.log('Preview URL:', result.previewUrl);
 * } else {
 *   console.error('Validation error:', result.error);
 * }
 */
export function handlePhotoUpload(file: File): PhotoValidationResult {
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPEG, PNG, and GIF files are supported.',
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size exceeds 5MB limit.',
    };
  }

  // Create preview URL
  const previewUrl = URL.createObjectURL(file);

  return {
    isValid: true,
    previewUrl,
  };
}

/**
 * Validates file type only
 * 
 * @param file - The file to validate
 * @returns true if file type is JPEG, PNG, or GIF
 */
export function isValidFileType(file: File): boolean {
  return ALLOWED_FILE_TYPES.includes(file.type);
}

/**
 * Validates file size only
 * 
 * @param file - The file to validate
 * @returns true if file size is 5MB or less
 */
export function isValidFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

/**
 * Gets a human-readable file size string
 * 
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

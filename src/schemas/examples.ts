/**
 * Example usage of validation schemas
 * This file demonstrates how to use the Zod schemas for validation
 */

import {
  loginSchema,
  registerSchema,
  clothingItemSchema,
  outfitSchema,
  validatePhotoFile,
} from './index';
import { ClothingCategory, ItemPosition } from '../types';

// Example 1: Login validation
export function validateLogin(email: string, password: string) {
  const result = loginSchema.safeParse({ email, password });
  
  if (result.success) {
    console.log('Login data is valid:', result.data);
    return { valid: true, data: result.data };
  } else {
    console.error('Login validation errors:', result.error.errors);
    return { valid: false, errors: result.error.errors };
  }
}

// Example 2: Registration validation
export function validateRegistration(data: {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}) {
  const result = registerSchema.safeParse(data);
  
  if (result.success) {
    return { valid: true, data: result.data };
  } else {
    return { valid: false, errors: result.error.errors };
  }
}

// Example 3: Clothing item validation
export function validateClothingItem(data: {
  name: string;
  primaryColor: string;
  category: ClothingCategory;
  brand?: string;
  notes?: string;
}) {
  const result = clothingItemSchema.safeParse(data);
  
  if (result.success) {
    return { valid: true, data: result.data };
  } else {
    return { valid: false, errors: result.error.errors };
  }
}

// Example 4: Outfit validation
export function validateOutfit(data: {
  name: string;
  notes?: string;
  items: Array<{ clothingItemId: number; position: ItemPosition }>;
}) {
  const result = outfitSchema.safeParse(data);
  
  if (result.success) {
    return { valid: true, data: result.data };
  } else {
    return { valid: false, errors: result.error.errors };
  }
}

// Example 5: Photo file validation
export function validatePhoto(file: File) {
  return validatePhotoFile(file);
}

// Example usage in a form submission handler
export async function handleLoginSubmit(formData: {
  email: string;
  password: string;
}) {
  // Validate the form data
  const validation = validateLogin(formData.email, formData.password);
  
  if (!validation.valid) {
    // Handle validation errors
    console.error('Validation failed:', validation.errors);
    return;
  }
  
  // Proceed with API call
  console.log('Submitting valid data:', validation.data);
  // await api.login(validation.data);
}

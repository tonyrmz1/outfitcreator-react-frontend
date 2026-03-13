import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  clothingItemSchema,
  outfitSchema,
  photoSchema,
} from './index';
import { ClothingCategory, ItemPosition } from '../types';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('should reject password without uppercase', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      expect(() => registerSchema.parse(invalidData)).toThrow();
    });

    it('should reject password without lowercase', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'PASSWORD123',
        confirmPassword: 'PASSWORD123',
        firstName: 'John',
        lastName: 'Doe',
      };
      expect(() => registerSchema.parse(invalidData)).toThrow();
    });

    it('should reject password without number', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'PasswordABC',
        confirmPassword: 'PasswordABC',
        firstName: 'John',
        lastName: 'Doe',
      };
      expect(() => registerSchema.parse(invalidData)).toThrow();
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password456',
        firstName: 'John',
        lastName: 'Doe',
      };
      expect(() => registerSchema.parse(invalidData)).toThrow();
    });
  });

  describe('clothingItemSchema', () => {
    it('should validate correct clothing item data', () => {
      const validData = {
        name: 'Blue Jeans',
        brand: 'Levis',
        primaryColor: 'blue',
        category: ClothingCategory.BOTTOM,
      };
      expect(() => clothingItemSchema.parse(validData)).not.toThrow();
    });

    it('should reject name exceeding 255 characters', () => {
      const invalidData = {
        name: 'a'.repeat(256),
        primaryColor: 'blue',
        category: ClothingCategory.BOTTOM,
      };
      expect(() => clothingItemSchema.parse(invalidData)).toThrow();
    });

    it('should reject brand exceeding 100 characters', () => {
      const invalidData = {
        name: 'Jeans',
        brand: 'a'.repeat(101),
        primaryColor: 'blue',
        category: ClothingCategory.BOTTOM,
      };
      expect(() => clothingItemSchema.parse(invalidData)).toThrow();
    });

    it('should reject notes exceeding 1000 characters', () => {
      const invalidData = {
        name: 'Jeans',
        primaryColor: 'blue',
        category: ClothingCategory.BOTTOM,
        notes: 'a'.repeat(1001),
      };
      expect(() => clothingItemSchema.parse(invalidData)).toThrow();
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        name: 'Jeans',
      };
      expect(() => clothingItemSchema.parse(invalidData)).toThrow();
    });
  });

  describe('outfitSchema', () => {
    it('should validate correct outfit data', () => {
      const validData = {
        name: 'Summer Outfit',
        notes: 'Perfect for beach',
        items: [
          { clothingItemId: 1, position: ItemPosition.TOP },
          { clothingItemId: 2, position: ItemPosition.BOTTOM },
        ],
      };
      expect(() => outfitSchema.parse(validData)).not.toThrow();
    });

    it('should reject name exceeding 255 characters', () => {
      const invalidData = {
        name: 'a'.repeat(256),
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
      };
      expect(() => outfitSchema.parse(invalidData)).toThrow();
    });

    it('should reject outfit without items', () => {
      const invalidData = {
        name: 'Empty Outfit',
        items: [],
      };
      expect(() => outfitSchema.parse(invalidData)).toThrow();
    });

    it('should reject notes exceeding 1000 characters', () => {
      const invalidData = {
        name: 'Outfit',
        notes: 'a'.repeat(1001),
        items: [{ clothingItemId: 1, position: ItemPosition.TOP }],
      };
      expect(() => outfitSchema.parse(invalidData)).toThrow();
    });
  });

  describe('photoSchema', () => {
    it('should validate correct photo file', () => {
      const validFile = new File(['content'], 'photo.jpg', {
        type: 'image/jpeg',
      });
      const validData = { file: validFile };
      expect(() => photoSchema.parse(validData)).not.toThrow();
    });

    it('should reject file exceeding 5MB', () => {
      const largeContent = new Uint8Array(6 * 1024 * 1024); // 6MB
      const largeFile = new File([largeContent], 'large.jpg', {
        type: 'image/jpeg',
      });
      const invalidData = { file: largeFile };
      expect(() => photoSchema.parse(invalidData)).toThrow();
    });

    it('should reject unsupported file type', () => {
      const invalidFile = new File(['content'], 'document.pdf', {
        type: 'application/pdf',
      });
      const invalidData = { file: invalidFile };
      expect(() => photoSchema.parse(invalidData)).toThrow();
    });

    it('should accept PNG files', () => {
      const validFile = new File(['content'], 'photo.png', {
        type: 'image/png',
      });
      const validData = { file: validFile };
      expect(() => photoSchema.parse(validData)).not.toThrow();
    });

    it('should accept GIF files', () => {
      const validFile = new File(['content'], 'photo.gif', {
        type: 'image/gif',
      });
      const validData = { file: validFile };
      expect(() => photoSchema.parse(validData)).not.toThrow();
    });
  });
});

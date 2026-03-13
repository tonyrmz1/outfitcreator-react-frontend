import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  handlePhotoUpload,
  isValidFileType,
  isValidFileSize,
  formatFileSize,
} from './photo';

describe('photo utilities', () => {
  // Mock URL.createObjectURL
  const mockCreateObjectURL = vi.fn();
  const mockRevokeObjectURL = vi.fn();

  beforeEach(() => {
    globalThis.URL.createObjectURL = mockCreateObjectURL;
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL;
    mockCreateObjectURL.mockReturnValue('blob:mock-url');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('handlePhotoUpload', () => {
    it('should accept valid JPEG file under 5MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

      const result = handlePhotoUpload(file);

      expect(result.isValid).toBe(true);
      expect(result.previewUrl).toBe('blob:mock-url');
      expect(result.error).toBeUndefined();
      expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    });

    it('should accept valid PNG file under 5MB', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 }); // 2MB

      const result = handlePhotoUpload(file);

      expect(result.isValid).toBe(true);
      expect(result.previewUrl).toBe('blob:mock-url');
      expect(result.error).toBeUndefined();
    });

    it('should accept valid GIF file under 5MB', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' });
      Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 }); // 3MB

      const result = handlePhotoUpload(file);

      expect(result.isValid).toBe(true);
      expect(result.previewUrl).toBe('blob:mock-url');
      expect(result.error).toBeUndefined();
    });

    it('should reject file with invalid type', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

      const result = handlePhotoUpload(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid file type. Only JPEG, PNG, and GIF files are supported.');
      expect(result.previewUrl).toBeUndefined();
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });

    it('should reject WEBP file type', () => {
      const file = new File(['test'], 'test.webp', { type: 'image/webp' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

      const result = handlePhotoUpload(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid file type. Only JPEG, PNG, and GIF files are supported.');
      expect(result.previewUrl).toBeUndefined();
    });

    it('should reject file exceeding 5MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }); // 6MB

      const result = handlePhotoUpload(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File size exceeds 5MB limit.');
      expect(result.previewUrl).toBeUndefined();
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });

    it('should reject file exactly at 5MB + 1 byte', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 + 1 }); // 5MB + 1 byte

      const result = handlePhotoUpload(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File size exceeds 5MB limit.');
      expect(result.previewUrl).toBeUndefined();
    });

    it('should accept file exactly at 5MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 }); // Exactly 5MB

      const result = handlePhotoUpload(file);

      expect(result.isValid).toBe(true);
      expect(result.previewUrl).toBe('blob:mock-url');
      expect(result.error).toBeUndefined();
    });

    it('should reject file with both invalid type and size', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }); // 6MB

      const result = handlePhotoUpload(file);

      // Should fail on type check first
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid file type. Only JPEG, PNG, and GIF files are supported.');
      expect(result.previewUrl).toBeUndefined();
    });

    it('should accept very small valid file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 100 }); // 100 bytes

      const result = handlePhotoUpload(file);

      expect(result.isValid).toBe(true);
      expect(result.previewUrl).toBe('blob:mock-url');
      expect(result.error).toBeUndefined();
    });
  });

  describe('isValidFileType', () => {
    it('should return true for JPEG', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      expect(isValidFileType(file)).toBe(true);
    });

    it('should return true for PNG', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      expect(isValidFileType(file)).toBe(true);
    });

    it('should return true for GIF', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' });
      expect(isValidFileType(file)).toBe(true);
    });

    it('should return false for PDF', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      expect(isValidFileType(file)).toBe(false);
    });

    it('should return false for WEBP', () => {
      const file = new File(['test'], 'test.webp', { type: 'image/webp' });
      expect(isValidFileType(file)).toBe(false);
    });

    it('should return false for SVG', () => {
      const file = new File(['test'], 'test.svg', { type: 'image/svg+xml' });
      expect(isValidFileType(file)).toBe(false);
    });
  });

  describe('isValidFileSize', () => {
    it('should return true for file under 5MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      expect(isValidFileSize(file)).toBe(true);
    });

    it('should return true for file exactly at 5MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 }); // 5MB
      expect(isValidFileSize(file)).toBe(true);
    });

    it('should return false for file over 5MB', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }); // 6MB
      expect(isValidFileSize(file)).toBe(false);
    });

    it('should return false for file at 5MB + 1 byte', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 + 1 }); // 5MB + 1 byte
      expect(isValidFileSize(file)).toBe(false);
    });

    it('should return true for very small file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 100 }); // 100 bytes
      expect(isValidFileSize(file)).toBe(true);
    });

    it('should return true for zero-byte file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 0 });
      expect(isValidFileSize(file)).toBe(true);
    });
  });

  describe('formatFileSize', () => {
    it('should format 0 bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(2 * 1024 * 1024)).toBe('2 MB');
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });

    it('should format 5MB exactly', () => {
      expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    });

    it('should format gigabytes', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatFileSize(1.5 * 1024 * 1024 * 1024)).toBe('1.5 GB');
    });

    it('should round to 2 decimal places', () => {
      expect(formatFileSize(1234567)).toBe('1.18 MB');
    });
  });
});

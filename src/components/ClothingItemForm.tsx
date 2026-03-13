import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { clothingItemSchema } from '../utils/validation';
import { ClothingItemFormData, ClothingCategory, Season, FitCategory } from '../types';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';

export interface ClothingItemFormProps {
  item?: ClothingItemFormData & { photoUrl?: string };
  onSubmit: (data: ClothingItemFormData, photo?: File) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ClothingItemForm: React.FC<ClothingItemFormProps> = ({
  item,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(item?.photoUrl || null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClothingItemFormData>({
    resolver: zodResolver(clothingItemSchema),
    defaultValues: item || {
      name: '',
      brand: '',
      primaryColor: '',
      secondaryColor: '',
      category: ClothingCategory.TOP,
      size: '',
      season: undefined,
      fitCategory: undefined,
      purchaseDate: '',
    },
  });

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setPhotoError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setPhotoError('File size must be less than 5MB');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setPhotoError('Only JPEG, PNG, and GIF files are supported');
      } else {
        setPhotoError('Invalid file');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPhotoFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleFormSubmit = async (data: ClothingItemFormData) => {
    try {
      await onSubmit(data, photoFile || undefined);
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name field */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            label="Name"
            value={field.value}
            onChange={field.onChange}
            error={errors.name?.message}
            placeholder="e.g., Blue Denim Jacket"
            required
            disabled={isLoading}
          />
        )}
      />

      {/* Brand field */}
      <Controller
        name="brand"
        control={control}
        render={({ field }) => (
          <Input
            label="Brand"
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.brand?.message}
            placeholder="e.g., Levi's"
            disabled={isLoading}
          />
        )}
      />

      {/* Category field */}
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select
            label="Category"
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: ClothingCategory.TOP, label: 'Top' },
              { value: ClothingCategory.BOTTOM, label: 'Bottom' },
              { value: ClothingCategory.FOOTWEAR, label: 'Footwear' },
              { value: ClothingCategory.OUTERWEAR, label: 'Outerwear' },
              { value: ClothingCategory.ACCESSORIES, label: 'Accessories' },
            ]}
            error={errors.category?.message}
            required
            disabled={isLoading}
          />
        )}
      />

      {/* Primary Color field */}
      <Controller
        name="primaryColor"
        control={control}
        render={({ field }) => (
          <Input
            label="Primary Color"
            value={field.value}
            onChange={field.onChange}
            error={errors.primaryColor?.message}
            placeholder="e.g., blue"
            required
            disabled={isLoading}
          />
        )}
      />

      {/* Secondary Color field */}
      <Controller
        name="secondaryColor"
        control={control}
        render={({ field }) => (
          <Input
            label="Secondary Color"
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.secondaryColor?.message}
            placeholder="e.g., white"
            disabled={isLoading}
          />
        )}
      />

      {/* Size field */}
      <Controller
        name="size"
        control={control}
        render={({ field }) => (
          <Input
            label="Size"
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.size?.message}
            placeholder="e.g., M, L, 32"
            disabled={isLoading}
          />
        )}
      />

      {/* Season field */}
      <Controller
        name="season"
        control={control}
        render={({ field }) => (
          <Select
            label="Season"
            value={field.value || ''}
            onChange={field.onChange}
            options={[
              { value: '', label: 'Select season' },
              { value: Season.SPRING, label: 'Spring' },
              { value: Season.SUMMER, label: 'Summer' },
              { value: Season.AUTUMN, label: 'Autumn' },
              { value: Season.WINTER, label: 'Winter' },
              { value: Season.ALL_SEASON, label: 'All Season' },
            ]}
            error={errors.season?.message}
            disabled={isLoading}
          />
        )}
      />

      {/* Fit Category field */}
      <Controller
        name="fitCategory"
        control={control}
        render={({ field }) => (
          <Select
            label="Fit"
            value={field.value || ''}
            onChange={field.onChange}
            options={[
              { value: '', label: 'Select fit' },
              { value: FitCategory.TIGHT, label: 'Tight' },
              { value: FitCategory.REGULAR, label: 'Regular' },
              { value: FitCategory.LOOSE, label: 'Loose' },
              { value: FitCategory.OVERSIZED, label: 'Oversized' },
            ]}
            error={errors.fitCategory?.message}
            disabled={isLoading}
          />
        )}
      />

      {/* Purchase Date field */}
      <Controller
        name="purchaseDate"
        control={control}
        render={({ field }) => (
          <Input
            label="Purchase Date"
            type="date"
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.purchaseDate?.message}
            disabled={isLoading}
          />
        )}
      />

      {/* Photo Upload */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photo
        </label>
        
        {photoPreview ? (
          <div className="space-y-2">
            <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={removePhoto}
              disabled={isLoading}
              fullWidth
            >
              Remove Photo
            </Button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} disabled={isLoading} aria-label="Photo upload" />
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600 text-center">
              {isDragActive ? (
                'Drop the photo here'
              ) : (
                <>
                  Drag and drop a photo here, or click to select
                  <br />
                  <span className="text-xs text-gray-500">
                    JPEG, PNG, or GIF (max 5MB)
                  </span>
                </>
              )}
            </p>
          </div>
        )}
        
        {photoError && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {photoError}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          loading={isLoading}
          fullWidth
        >
          {item ? 'Update Item' : 'Create Item'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

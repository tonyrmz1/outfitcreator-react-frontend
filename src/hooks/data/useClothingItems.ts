import { useState, useCallback } from 'react';
import clothingItemsAPI from '../../api/endpoints/clothing';
import type {
  ClothingItem,
  ClothingItemFormData,
  ClothingItemFilters,
  PaginationState,
} from '../../types';

interface UseClothingItemsReturn {
  items: ClothingItem[];
  pagination: PaginationState;
  isLoading: boolean;
  error: string | null;
  fetchItems: (filters?: ClothingItemFilters, page?: number) => Promise<void>;
  createItem: (data: ClothingItemFormData, photo?: File) => Promise<ClothingItem>;
  updateItem: (id: number, data: ClothingItemFormData) => Promise<ClothingItem>;
  deleteItem: (id: number) => Promise<void>;
  uploadPhoto: (id: number, photo: File) => Promise<ClothingItem>;
}

export function useClothingItems(): UseClothingItemsReturn {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (filters?: ClothingItemFilters, page = 0): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await clothingItemsAPI.getAll(filters, page, pagination.size);
      setItems(response.content);
      setPagination({
        page: response.number,
        size: response.size,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      });
    } catch (err) {
      const errorMessage = 'Failed to fetch clothing items';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [pagination.size]);

  const createItem = async (data: ClothingItemFormData, photo?: File): Promise<ClothingItem> => {
    // Optimistic update: create temporary item
    const tempItem: ClothingItem = {
      id: Date.now(), // Temporary ID
      name: data.name,
      brand: data.brand,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      category: data.category,
      size: data.size,
      season: data.season,
      fitCategory: data.fitCategory,
      purchaseDate: data.purchaseDate,
      photoUrl: undefined,
      wearCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistically add to items
    setItems((prev) => [tempItem, ...prev]);

    try {
      const newItem = await clothingItemsAPI.create(data, photo);
      // Replace temporary item with real item
      setItems((prev) => prev.map((item) => (item.id === tempItem.id ? newItem : item)));
      return newItem;
    } catch (err) {
      // Revert optimistic update on failure
      setItems((prev) => prev.filter((item) => item.id !== tempItem.id));
      setError('Failed to create clothing item');
      throw err;
    }
  };

  const updateItem = async (id: number, data: ClothingItemFormData): Promise<ClothingItem> => {
    // Store original item for rollback
    const originalItem = items.find((item) => item.id === id);
    if (!originalItem) {
      throw new Error('Item not found');
    }

    // Optimistic update
    const optimisticItem: ClothingItem = {
      ...originalItem,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setItems((prev) => prev.map((item) => (item.id === id ? optimisticItem : item)));

    try {
      const updatedItem = await clothingItemsAPI.update(id, data);
      // Replace with actual updated item
      setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
      return updatedItem;
    } catch (err) {
      // Revert optimistic update on failure
      setItems((prev) => prev.map((item) => (item.id === id ? originalItem : item)));
      setError('Failed to update clothing item');
      throw err;
    }
  };

  const deleteItem = async (id: number): Promise<void> => {
    // Store original item for rollback
    const originalItem = items.find((item) => item.id === id);
    if (!originalItem) {
      throw new Error('Item not found');
    }

    // Optimistic update: remove item
    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await clothingItemsAPI.delete(id);
    } catch (err) {
      // Revert optimistic update on failure
      setItems((prev) => [...prev, originalItem]);
      setError('Failed to delete clothing item');
      throw err;
    }
  };

  const uploadPhoto = async (id: number, photo: File): Promise<ClothingItem> => {
    try {
      const updatedItem = await clothingItemsAPI.uploadPhoto(id, photo);
      setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
      return updatedItem;
    } catch (err) {
      setError('Failed to upload photo');
      throw err;
    }
  };

  return {
    items,
    pagination,
    isLoading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    uploadPhoto,
  };
}

import { useState } from 'react';
import outfitsAPI from '../api/outfits';
import type { Outfit, OutfitFormData, PaginationState } from '../types';

interface UseOutfitsReturn {
  outfits: Outfit[];
  pagination: PaginationState;
  isLoading: boolean;
  error: string | null;
  fetchOutfits: (page?: number) => Promise<void>;
  createOutfit: (data: OutfitFormData) => Promise<Outfit>;
  updateOutfit: (id: number, data: Partial<OutfitFormData>) => Promise<Outfit>;
  deleteOutfit: (id: number) => Promise<void>;
}

export function useOutfits(): UseOutfitsReturn {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOutfits = async (page = 0): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await outfitsAPI.getAll(page, pagination.size);
      setOutfits(response.content);
      setPagination({
        page: response.page,
        size: response.size,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      });
    } catch (err) {
      const errorMessage = 'Failed to fetch outfits';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createOutfit = async (data: OutfitFormData): Promise<Outfit> => {
    // Optimistic update: create temporary outfit
    const tempOutfit: Outfit = {
      id: Date.now(), // Temporary ID
      name: data.name,
      notes: data.notes,
      items: [], // Will be populated by backend
      isComplete: false, // Will be calculated by backend
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistically add to outfits
    setOutfits((prev) => [tempOutfit, ...prev]);

    try {
      const newOutfit = await outfitsAPI.create(data);
      // Replace temporary outfit with real outfit
      setOutfits((prev) => prev.map((outfit) => (outfit.id === tempOutfit.id ? newOutfit : outfit)));
      return newOutfit;
    } catch (err) {
      // Revert optimistic update on failure
      setOutfits((prev) => prev.filter((outfit) => outfit.id !== tempOutfit.id));
      setError('Failed to create outfit');
      throw err;
    }
  };

  const updateOutfit = async (id: number, data: Partial<OutfitFormData>): Promise<Outfit> => {
    // Store original outfit for rollback
    const originalOutfit = outfits.find((outfit) => outfit.id === id);
    if (!originalOutfit) {
      throw new Error('Outfit not found');
    }

    // Optimistic update
    const optimisticOutfit: Outfit = {
      ...originalOutfit,
      name: data.name ?? originalOutfit.name,
      notes: data.notes ?? originalOutfit.notes,
      updatedAt: new Date().toISOString(),
    };
    setOutfits((prev) => prev.map((outfit) => (outfit.id === id ? optimisticOutfit : outfit)));

    try {
      const updatedOutfit = await outfitsAPI.update(id, data);
      // Replace with actual updated outfit
      setOutfits((prev) => prev.map((outfit) => (outfit.id === id ? updatedOutfit : outfit)));
      return updatedOutfit;
    } catch (err) {
      // Revert optimistic update on failure
      setOutfits((prev) => prev.map((outfit) => (outfit.id === id ? originalOutfit : outfit)));
      setError('Failed to update outfit');
      throw err;
    }
  };

  const deleteOutfit = async (id: number): Promise<void> => {
    // Store original outfit for rollback
    const originalOutfit = outfits.find((outfit) => outfit.id === id);
    if (!originalOutfit) {
      throw new Error('Outfit not found');
    }

    // Optimistic update: remove outfit
    setOutfits((prev) => prev.filter((outfit) => outfit.id !== id));

    try {
      await outfitsAPI.delete(id);
    } catch (err) {
      // Revert optimistic update on failure
      setOutfits((prev) => [...prev, originalOutfit]);
      setError('Failed to delete outfit');
      throw err;
    }
  };

  return {
    outfits,
    pagination,
    isLoading,
    error,
    fetchOutfits,
    createOutfit,
    updateOutfit,
    deleteOutfit,
  };
}

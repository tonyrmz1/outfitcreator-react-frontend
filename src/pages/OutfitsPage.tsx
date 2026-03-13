import React, { useState, useEffect } from 'react';
import { useOutfits } from '../hooks/useOutfits';
import { OutfitCard } from '../components/OutfitCard';
import { OutfitBuilder } from '../components/OutfitBuilder';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/Button';
import type { Outfit, OutfitFormData } from '../types';

/**
 * OutfitsPage - Outfit management page
 * 
 * Features:
 * - Display grid of saved outfits
 * - Create new outfits using OutfitBuilder modal
 * - Edit existing outfits
 * - Delete outfits with confirmation
 * - Pagination for large outfit lists
 * - Loading and error states
 * 
 * Requirements: 7.5, 7.6, 7.7, 7.8, 8.1, 13.2, 14.1, 14.3
 */
export const OutfitsPage: React.FC = () => {
  const {
    outfits,
    pagination,
    isLoading,
    error,
    fetchOutfits,
    createOutfit,
    updateOutfit,
    deleteOutfit,
  } = useOutfits();

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);

  // Fetch outfits on mount
  useEffect(() => {
    fetchOutfits(0);
  }, []);

  const handlePageChange = (page: number) => {
    fetchOutfits(page);
  };

  const handleCreateOutfit = () => {
    setEditingOutfit(null);
    setIsBuilderOpen(true);
  };

  const handleEditOutfit = (outfit: Outfit) => {
    setEditingOutfit(outfit);
    setIsBuilderOpen(true);
  };

  const handleDeleteOutfit = async (outfitId: number) => {
    const outfit = outfits.find((o) => o.id === outfitId);
    const outfitName = outfit?.name || 'this outfit';
    
    if (window.confirm(`Are you sure you want to delete "${outfitName}"?`)) {
      try {
        await deleteOutfit(outfitId);
      } catch (err) {
        // Error is already handled by the hook
        console.error('Failed to delete outfit:', err);
      }
    }
  };

  const handleSaveOutfit = async (data: OutfitFormData) => {
    try {
      if (editingOutfit) {
        // Update existing outfit
        await updateOutfit(editingOutfit.id, data);
      } else {
        // Create new outfit
        await createOutfit(data);
      }
      
      setIsBuilderOpen(false);
      setEditingOutfit(null);
    } catch (err) {
      // Error is already handled by the hook
      console.error('Failed to save outfit:', err);
      throw err; // Re-throw to let OutfitBuilder handle it
    }
  };

  const handleBuilderClose = () => {
    setIsBuilderOpen(false);
    setEditingOutfit(null);
  };

  const handleRetry = () => {
    fetchOutfits(pagination.page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Outfits</h1>
        <Button onClick={handleCreateOutfit} variant="primary">
          Create Outfit
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onRetry={handleRetry} />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Outfits Grid */}
      {!isLoading && outfits.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            {outfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                onEdit={handleEditOutfit}
                onDelete={handleDeleteOutfit}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              pageSize={pagination.size}
              totalItems={pagination.totalElements}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && outfits.length === 0 && !error && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No outfits</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first outfit.
          </p>
          <div className="mt-6">
            <Button onClick={handleCreateOutfit} variant="primary">
              Create Outfit
            </Button>
          </div>
        </div>
      )}

      {/* Outfit Builder Modal */}
      <OutfitBuilder
        isOpen={isBuilderOpen}
        onClose={handleBuilderClose}
        onSave={handleSaveOutfit}
        editingOutfit={editingOutfit || undefined}
      />
    </div>
  );
};

export default OutfitsPage;

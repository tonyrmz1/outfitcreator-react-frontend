import React, { useState, useEffect } from 'react';
import { useClothingItems } from '../hooks/useClothingItems';
import { FilterPanel } from '../components/FilterPanel';
import { ClothingItemCard } from '../components/ClothingItemCard';
import { ClothingItemForm } from '../components/ClothingItemForm';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import type { ClothingItemFilters, ClothingItem, ClothingItemFormData } from '../types';

/**
 * ClosetPage - Main closet management page
 * 
 * Features:
 * - Display grid of clothing items with photos
 * - Filter items by category, season, color, and search query
 * - Pagination for large item lists
 * - Create new clothing items with photo upload
 * - Edit existing clothing items
 * - Delete clothing items with confirmation
 * - Loading and error states
 * 
 * Requirements: 3.1, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 6.1, 6.2, 6.3, 6.4, 6.5, 13.2, 14.1, 14.3, 3.4
 */
export const ClosetPage: React.FC = () => {
  const {
    items,
    pagination,
    isLoading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    uploadPhoto,
  } = useClothingItems();

  const [filters, setFilters] = useState<ClothingItemFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch items on mount and when filters or page changes
  useEffect(() => {
    fetchItems(filters, 0);
  }, [filters]);

  const handleFilterChange = (newFilters: ClothingItemFilters) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  const handlePageChange = (page: number) => {
    fetchItems(filters, page);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: ClothingItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = async (itemId: number) => {
    const item = items.find((i) => i.id === itemId);
    const itemName = item?.name || 'this item';
    
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        await deleteItem(itemId);
      } catch (err) {
        // Error is already handled by the hook
        console.error('Failed to delete item:', err);
      }
    }
  };

  const handleFormSubmit = async (data: ClothingItemFormData, photo?: File) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        // Update existing item
        await updateItem(editingItem.id, data);
        
        // If there's a new photo, upload it separately
        if (photo) {
          await uploadPhoto(editingItem.id, photo);
        }
      } else {
        // Create new item
        await createItem(data, photo);
      }
      
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      // Error is already handled by the hook
      console.error('Failed to submit form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleRetry = () => {
    fetchItems(filters, pagination.page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Closet</h1>
        <Button onClick={handleAddItem} variant="primary">
          Add Item
        </Button>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
      />

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

      {/* Items Grid */}
      {!isLoading && items.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            {items.map((item) => (
              <ClothingItemCard
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
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
      {!isLoading && items.length === 0 && !error && (
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clothing items</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first clothing item.
          </p>
          <div className="mt-6">
            <Button onClick={handleAddItem} variant="primary">
              Add Item
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={editingItem ? 'Edit Clothing Item' : 'Add Clothing Item'}
        size="lg"
      >
        <ClothingItemForm
          item={
            editingItem
              ? {
                  name: editingItem.name,
                  brand: editingItem.brand,
                  primaryColor: editingItem.primaryColor,
                  secondaryColor: editingItem.secondaryColor,
                  category: editingItem.category,
                  size: editingItem.size,
                  season: editingItem.season,
                  fitCategory: editingItem.fitCategory,
                  purchaseDate: editingItem.purchaseDate,
                  photoUrl: editingItem.photoUrl,
                }
              : undefined
          }
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default ClosetPage;

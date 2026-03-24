import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { ErrorMessage } from '../../common/ErrorMessage';
import { useClothingItems } from '../../../hooks/data/useClothingItems';
import { validateOutfit } from '../../../utils/validation';
import type {
  ClothingItem,
  OutfitFormData,
  OutfitItemSelection,
  Outfit,
} from '../../../types';
import { ItemPosition, ClothingCategory } from '../../../types';

export interface OutfitBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (outfit: OutfitFormData) => Promise<void>;
  editingOutfit?: Outfit;
}

export const OutfitBuilder: React.FC<OutfitBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  editingOutfit,
}) => {
  const { items, fetchItems, isLoading: itemsLoading, error: itemsError } = useClothingItems();
  const [outfitName, setOutfitName] = useState('');
  const [outfitNotes, setOutfitNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<OutfitItemSelection[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load items when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen, fetchItems]);

  // Initialize form with editing outfit data
  useEffect(() => {
    if (editingOutfit) {
      setOutfitName(editingOutfit.name);
      setOutfitNotes(editingOutfit.notes || '');
      setSelectedItems(
        editingOutfit.items.map((item) => ({
          clothingItemId: item.clothingItem.id,
          position: item.position,
        }))
      );
    } else {
      // Reset form for new outfit
      setOutfitName('');
      setOutfitNotes('');
      setSelectedItems([]);
    }
    setValidationErrors([]);
  }, [editingOutfit, isOpen]);

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<ClothingCategory, ClothingItem[]>);

  // Map category to position
  const categoryToPosition = (category: ClothingCategory): ItemPosition => {
    switch (category) {
      case ClothingCategory.TOP:
        return ItemPosition.TOP;
      case ClothingCategory.BOTTOM:
        return ItemPosition.BOTTOM;
      case ClothingCategory.FOOTWEAR:
        return ItemPosition.FOOTWEAR;
      case ClothingCategory.OUTERWEAR:
        return ItemPosition.OUTERWEAR;
      case ClothingCategory.ACCESSORIES:
        return ItemPosition.ACCESSORY;
      default:
        return ItemPosition.TOP;
    }
  };

  // Handle item selection
  const handleItemSelect = (item: ClothingItem) => {
    const position = categoryToPosition(item.category);
    
    setSelectedItems((prev) => {
      // Remove existing item in this position (replace)
      const filtered = prev.filter((i) => i.position !== position);
      // Add new item
      return [...filtered, { clothingItemId: item.id, position }];
    });
  };

  // Handle item removal
  const handleItemRemove = (position: ItemPosition) => {
    setSelectedItems((prev) => prev.filter((i) => i.position !== position));
  };

  // Check if item is selected
  const isItemSelected = (itemId: number): boolean => {
    return selectedItems.some((i) => i.clothingItemId === itemId);
  };

  // Get selected item for a position
  const getSelectedItemForPosition = (position: ItemPosition): ClothingItem | undefined => {
    const selection = selectedItems.find((i) => i.position === position);
    if (!selection) return undefined;
    return items.find((item) => item.id === selection.clothingItemId);
  };

  // Handle save
  const handleSave = async () => {
    const outfitData: OutfitFormData = {
      name: outfitName,
      notes: outfitNotes || undefined,
      items: selectedItems,
    };

    // Validate outfit
    const validation = validateOutfit(outfitData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors([]);
    setIsSaving(true);

    try {
      await onSave(outfitData);
      onClose();
    } catch (error) {
      // Error handling is done by parent component
      setValidationErrors(['Failed to save outfit. Please try again.']);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setValidationErrors([]);
    onClose();
  };

  // Position slots to display
  const positionSlots: ItemPosition[] = [
    ItemPosition.TOP,
    ItemPosition.BOTTOM,
    ItemPosition.FOOTWEAR,
    ItemPosition.OUTERWEAR,
    ItemPosition.ACCESSORY,
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={editingOutfit ? 'Edit Outfit' : 'Create Outfit'}
      size="xl"
    >
      <div className="space-y-6">
        {/* Outfit Name Input */}
        <Input
          label="Outfit Name"
          value={outfitName}
          onChange={(e) => setOutfitName(e.target.value)}
          placeholder="e.g., Casual Friday"
          required
          disabled={isSaving}
        />

        {/* Outfit Notes Input */}
        <div className="w-full">
          <label
            htmlFor="outfit-notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notes
          </label>
          <textarea
            id="outfit-notes"
            value={outfitNotes}
            onChange={(e) => setOutfitNotes(e.target.value)}
            placeholder="Add any notes about this outfit..."
            rows={3}
            disabled={isSaving}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
            aria-label="Outfit notes"
          />
        </div>

        {/* Selected Items by Position */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Selected Items
          </h3>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {positionSlots.map((position) => {
              const selectedItem = getSelectedItemForPosition(position);
              return (
                <div
                  key={position}
                  className={`flex flex-col rounded-lg bg-gray-50 p-2 transition-all ${
                    !selectedItem ? 'min-h-[120px]' : ''
                  }`}
                >
                  <div className="mb-1 text-xs font-medium text-gray-600">
                    {position}
                  </div>
                  {selectedItem ? (
                    <div className="flex flex-col">
                      {/* Same image frame as Available Items: square, full-width, object-cover */}
                      <div className="relative mb-1 aspect-square w-full overflow-hidden rounded-md">
                        <img
                          src={selectedItem.photoUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3ENo Photo%3C/text%3E%3C/svg%3E'}
                          alt={selectedItem.name}
                          className="h-full w-full object-cover"
                        />
                        <span
                          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-white shadow-md ring-2 ring-white"
                          title="Slot filled"
                          aria-hidden
                        >
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </div>
                      <div className="mb-1 truncate text-xs font-medium text-gray-700">
                        {selectedItem.name}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleItemRemove(position)}
                        disabled={isSaving}
                        aria-label={`Remove ${selectedItem.name} from ${position}`}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
                      No item selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Items by Category */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Available Items
          </h3>
          {itemsError ? (
            <ErrorMessage message="Failed to load clothing items. Please try again." />
          ) : itemsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No clothing items available. Add items to your closet first.
            </p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {category}
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {categoryItems.map((item) => {
                      const selected = isItemSelected(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleItemSelect(item)}
                          disabled={isSaving}
                          className={`relative rounded-lg p-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            selected
                              ? 'z-[1] border-2 border-secondary bg-tertiary/40 shadow-sm'
                              : 'border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }`}
                          aria-label={
                            selected
                              ? `${item.name} — selected in this outfit, tap to change`
                              : `Select ${item.name} for this outfit`
                          }
                          aria-pressed={selected}
                        >
                          <div className="relative mb-1 aspect-square overflow-hidden rounded-md">
                            <img
                              src={item.photoUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3ENo Photo%3C/text%3E%3C/svg%3E'}
                              alt=""
                              aria-hidden
                              className={`h-full w-full object-cover transition-[filter] ${
                                selected ? 'brightness-[0.97]' : ''
                              }`}
                            />
                            {selected && (
                              <>
                                <div
                                  className="pointer-events-none absolute inset-0 bg-primary/15"
                                  aria-hidden
                                />
                                <div
                                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-white shadow-md ring-2 ring-white"
                                  aria-hidden
                                >
                                  <svg
                                    className="h-3.5 w-3.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </>
                            )}
                          </div>
                          <div
                            className={`truncate text-xs font-medium ${
                              selected ? 'text-secondary' : 'text-gray-700'
                            }`}
                          >
                            {item.name}
                          </div>
                          {selected && (
                            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-secondary">
                              In outfit
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div
            className="bg-red-50 border border-red-200 rounded-lg p-4"
            role="alert"
          >
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Please fix the following errors:
            </h4>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || itemsLoading}
            loading={isSaving}
            fullWidth
          >
            {editingOutfit ? 'Update Outfit' : 'Save Outfit'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isSaving}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

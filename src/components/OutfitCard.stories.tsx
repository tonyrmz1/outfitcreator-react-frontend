import type { Meta, StoryObj } from '@storybook/react';
import { OutfitCard } from './OutfitCard';
import { Outfit, ClothingCategory, ItemPosition } from '../types';

const meta: Meta<typeof OutfitCard> = {
  title: 'Components/OutfitCard',
  component: OutfitCard,
  tags: ['autodocs'],
  argTypes: {
    onEdit: { action: 'edit clicked' },
    onDelete: { action: 'delete clicked' },
    onClick: { action: 'card clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof OutfitCard>;

const completeOutfit: Outfit = {
  id: 1,
  name: 'Summer Casual',
  notes: 'Perfect for a sunny day at the beach or a casual outdoor gathering',
  items: [
    {
      id: 1,
      clothingItem: {
        id: 1,
        name: 'Blue T-Shirt',
        brand: 'Nike',
        primaryColor: '#3B82F6',
        category: ClothingCategory.TOP,
        photoUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        wearCount: 5,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      position: ItemPosition.TOP,
    },
    {
      id: 2,
      clothingItem: {
        id: 2,
        name: 'Khaki Shorts',
        brand: 'Gap',
        primaryColor: '#D4A574',
        category: ClothingCategory.BOTTOM,
        photoUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
        wearCount: 3,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      position: ItemPosition.BOTTOM,
    },
    {
      id: 3,
      clothingItem: {
        id: 3,
        name: 'White Sneakers',
        brand: 'Adidas',
        primaryColor: '#FFFFFF',
        category: ClothingCategory.FOOTWEAR,
        photoUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        wearCount: 10,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      position: ItemPosition.FOOTWEAR,
    },
  ],
  isComplete: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const incompleteOutfit: Outfit = {
  id: 2,
  name: 'Work in Progress',
  notes: 'Still need to add shoes and accessories',
  items: [
    {
      id: 1,
      clothingItem: {
        id: 4,
        name: 'Black Blazer',
        brand: 'Hugo Boss',
        primaryColor: '#000000',
        category: ClothingCategory.OUTERWEAR,
        photoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
        wearCount: 2,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      position: ItemPosition.OUTERWEAR,
    },
  ],
  isComplete: false,
  createdAt: '2024-02-01T14:20:00Z',
  updatedAt: '2024-02-01T14:20:00Z',
};

const outfitWithManyItems: Outfit = {
  id: 3,
  name: 'Winter Formal',
  notes: 'Complete formal outfit for winter events and business meetings',
  items: [
    {
      id: 1,
      clothingItem: {
        id: 5,
        name: 'White Dress Shirt',
        brand: 'Brooks Brothers',
        primaryColor: '#FFFFFF',
        category: ClothingCategory.TOP,
        wearCount: 8,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      position: ItemPosition.TOP,
    },
    {
      id: 2,
      clothingItem: {
        id: 6,
        name: 'Navy Suit Pants',
        brand: 'Hugo Boss',
        primaryColor: '#1E3A8A',
        category: ClothingCategory.BOTTOM,
        wearCount: 6,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      position: ItemPosition.BOTTOM,
    },
    {
      id: 3,
      clothingItem: {
        id: 7,
        name: 'Black Leather Shoes',
        brand: 'Allen Edmonds',
        primaryColor: '#000000',
        category: ClothingCategory.FOOTWEAR,
        wearCount: 12,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      position: ItemPosition.FOOTWEAR,
    },
    {
      id: 4,
      clothingItem: {
        id: 8,
        name: 'Navy Blazer',
        brand: 'Hugo Boss',
        primaryColor: '#1E3A8A',
        category: ClothingCategory.OUTERWEAR,
        wearCount: 5,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      position: ItemPosition.OUTERWEAR,
    },
    {
      id: 5,
      clothingItem: {
        id: 9,
        name: 'Silk Tie',
        brand: 'Hermès',
        primaryColor: '#DC2626',
        category: ClothingCategory.ACCESSORIES,
        wearCount: 4,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      position: ItemPosition.ACCESSORY,
    },
  ],
  isComplete: true,
  createdAt: '2024-01-20T09:15:00Z',
  updatedAt: '2024-01-20T09:15:00Z',
};

const outfitWithLongNotes: Outfit = {
  ...completeOutfit,
  id: 4,
  name: 'Beach Day Outfit',
  notes:
    'This is a perfect outfit for a long day at the beach. The lightweight fabric keeps you cool, and the colors are vibrant and summery. Don\'t forget to bring sunscreen and a hat to protect yourself from the sun!',
};

const emptyOutfit: Outfit = {
  id: 5,
  name: 'Empty Outfit',
  notes: 'No items added yet',
  items: [],
  isComplete: false,
  createdAt: '2024-02-10T16:45:00Z',
  updatedAt: '2024-02-10T16:45:00Z',
};

export const Complete: Story = {
  args: {
    outfit: completeOutfit,
  },
};

export const Incomplete: Story = {
  args: {
    outfit: incompleteOutfit,
  },
};

export const WithActionButtons: Story = {
  args: {
    outfit: completeOutfit,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
  },
};

export const Clickable: Story = {
  args: {
    outfit: completeOutfit,
    onClick: () => console.log('Card clicked'),
  },
};

export const WithAllActions: Story = {
  args: {
    outfit: completeOutfit,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
    onClick: () => console.log('Card clicked'),
  },
};

export const WithManyItems: Story = {
  args: {
    outfit: outfitWithManyItems,
  },
};

export const WithLongNotes: Story = {
  args: {
    outfit: outfitWithLongNotes,
  },
};

export const Empty: Story = {
  args: {
    outfit: emptyOutfit,
  },
};

export const WithoutNotes: Story = {
  args: {
    outfit: {
      ...completeOutfit,
      notes: undefined,
    },
  },
};

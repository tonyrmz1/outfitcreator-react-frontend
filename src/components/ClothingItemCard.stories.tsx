import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ClothingItemCard } from './ClothingItemCard';
import { ClothingCategory } from '../types';

const meta = {
  title: 'Components/ClothingItemCard',
  component: ClothingItemCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    selectable: {
      control: 'boolean',
      description: 'Whether the card can be selected (for outfit builder)',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the card is currently selected',
    },
  },
  args: {
    onEdit: fn(),
    onDelete: fn(),
    onClick: fn(),
  },
} satisfies Meta<typeof ClothingItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: {
      id: 1,
      name: 'Blue Denim Jacket',
      brand: "Levi's",
      primaryColor: '#4169E1',
      secondaryColor: '#FFFFFF',
      category: ClothingCategory.OUTERWEAR,
      wearCount: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
};

export const WithPhoto: Story = {
  args: {
    item: {
      id: 2,
      name: 'Black Leather Boots',
      brand: 'Dr. Martens',
      primaryColor: '#000000',
      category: ClothingCategory.FOOTWEAR,
      photoUrl: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?w=400&h=400&fit=crop',
      wearCount: 12,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
};

export const WithoutBrand: Story = {
  args: {
    item: {
      id: 3,
      name: 'White T-Shirt',
      primaryColor: '#FFFFFF',
      category: ClothingCategory.TOP,
      wearCount: 20,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
};

export const WithoutSecondaryColor: Story = {
  args: {
    item: {
      id: 4,
      name: 'Red Sneakers',
      brand: 'Nike',
      primaryColor: '#FF0000',
      category: ClothingCategory.FOOTWEAR,
      wearCount: 8,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
};

export const Selectable: Story = {
  args: {
    item: {
      id: 5,
      name: 'Blue Jeans',
      brand: "Levi's",
      primaryColor: '#0000FF',
      secondaryColor: '#FFFFFF',
      category: ClothingCategory.BOTTOM,
      wearCount: 15,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    selectable: true,
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    item: {
      id: 6,
      name: 'Gray Hoodie',
      brand: 'Champion',
      primaryColor: '#808080',
      category: ClothingCategory.TOP,
      wearCount: 10,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    selectable: true,
    selected: true,
  },
};

export const WithoutActions: Story = {
  args: {
    item: {
      id: 7,
      name: 'Brown Belt',
      brand: 'Fossil',
      primaryColor: '#8B4513',
      category: ClothingCategory.ACCESSORIES,
      wearCount: 25,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    onEdit: undefined,
    onDelete: undefined,
  },
};

export const LongNames: Story = {
  args: {
    item: {
      id: 8,
      name: 'Extra Long Item Name That Should Be Truncated With Ellipsis',
      brand: 'Very Long Brand Name That Also Should Be Truncated',
      primaryColor: '#4B0082',
      secondaryColor: '#FFD700',
      category: ClothingCategory.TOP,
      wearCount: 3,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
};

export const MultipleColors: Story = {
  args: {
    item: {
      id: 9,
      name: 'Striped Shirt',
      brand: 'Ralph Lauren',
      primaryColor: '#000080',
      secondaryColor: '#FFFFFF',
      category: ClothingCategory.TOP,
      wearCount: 7,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
};

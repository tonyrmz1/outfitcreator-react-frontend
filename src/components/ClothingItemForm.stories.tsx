import type { Meta, StoryObj } from '@storybook/react';
import { ClothingItemForm } from './ClothingItemForm';
import { ClothingCategory, Season, FitCategory, ClothingItemFormData } from '../types';

const meta = {
  title: 'Components/ClothingItemForm',
  component: ClothingItemForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ClothingItemForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateMode: Story = {
  args: {
    onSubmit: async (data: ClothingItemFormData, photo?: File) => {
      console.log('Form submitted:', data, photo);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onCancel: () => console.log('Form cancelled'),
    isLoading: false,
  },
};

export const EditMode: Story = {
  args: {
    item: {
      name: 'Blue Denim Jacket',
      brand: "Levi's",
      primaryColor: 'blue',
      secondaryColor: 'white',
      category: ClothingCategory.OUTERWEAR,
      size: 'M',
      season: Season.AUTUMN,
      fitCategory: FitCategory.REGULAR,
      purchaseDate: '2024-01-15',
      photoUrl: 'https://via.placeholder.com/400x400/4A90E2/FFFFFF?text=Denim+Jacket',
    },
    onSubmit: async (data: ClothingItemFormData, photo?: File) => {
      console.log('Form submitted:', data, photo);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onCancel: () => console.log('Form cancelled'),
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: async (data: ClothingItemFormData, photo?: File) => {
      console.log('Form submitted:', data, photo);
    },
    onCancel: () => console.log('Form cancelled'),
    isLoading: true,
  },
};

export const WithMinimalData: Story = {
  args: {
    item: {
      name: 'Red T-Shirt',
      primaryColor: 'red',
      category: ClothingCategory.TOP,
    },
    onSubmit: async (data: ClothingItemFormData, photo?: File) => {
      console.log('Form submitted:', data, photo);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onCancel: () => console.log('Form cancelled'),
    isLoading: false,
  },
};

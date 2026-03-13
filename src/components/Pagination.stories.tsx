import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 0 },
      description: 'Current page index (0-based)',
    },
    totalPages: {
      control: { type: 'number', min: 0 },
      description: 'Total number of pages',
    },
    pageSize: {
      control: { type: 'number', min: 1 },
      description: 'Number of items per page',
    },
    totalItems: {
      control: { type: 'number', min: 0 },
      description: 'Total number of items',
    },
  },
  args: {
    onPageChange: fn(),
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: {
    currentPage: 0,
    totalPages: 10,
    pageSize: 20,
    totalItems: 200,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    pageSize: 20,
    totalItems: 200,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 9,
    totalPages: 10,
    pageSize: 20,
    totalItems: 200,
  },
};

export const PartialLastPage: Story = {
  args: {
    currentPage: 4,
    totalPages: 5,
    pageSize: 20,
    totalItems: 95,
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 0,
    totalPages: 1,
    pageSize: 20,
    totalItems: 15,
  },
};

export const EmptyResults: Story = {
  args: {
    currentPage: 0,
    totalPages: 0,
    pageSize: 20,
    totalItems: 0,
  },
};

export const LargeDataset: Story = {
  args: {
    currentPage: 50,
    totalPages: 100,
    pageSize: 20,
    totalItems: 2000,
  },
};

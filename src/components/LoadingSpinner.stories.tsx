import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the spinner',
    },
    fullScreen: {
      control: 'boolean',
      description: 'Whether to display the spinner in fullscreen mode',
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const FullScreen: Story = {
  args: {
    fullScreen: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const InlineUsage: Story = {
  args: {
    size: 'md',
  },
  render: (args) => (
    <div className="p-8 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Loading content...</h3>
      <LoadingSpinner {...args} />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-600">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="md" />
        <span className="text-sm text-gray-600">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="lg" />
        <span className="text-sm text-gray-600">Large</span>
      </div>
    </div>
  ),
};

import { useState } from 'react';
import { Select, SelectOption } from './Select';

export default {
  title: 'Components/Select',
  component: Select,
};

const categoryOptions: SelectOption[] = [
  { value: 'TOP', label: 'Top' },
  { value: 'BOTTOM', label: 'Bottom' },
  { value: 'FOOTWEAR', label: 'Footwear' },
  { value: 'OUTERWEAR', label: 'Outerwear' },
  { value: 'ACCESSORIES', label: 'Accessories' },
];

const seasonOptions: SelectOption[] = [
  { value: 'SPRING', label: 'Spring' },
  { value: 'SUMMER', label: 'Summer' },
  { value: 'AUTUMN', label: 'Autumn' },
  { value: 'WINTER', label: 'Winter' },
  { value: 'ALL_SEASON', label: 'All Season' },
];

export const Default = () => {
  const [value, setValue] = useState('');
  return (
    <Select
      label="Category"
      value={value}
      onChange={setValue}
      options={categoryOptions}
    />
  );
};

export const WithPlaceholder = () => {
  const [value, setValue] = useState('');
  return (
    <Select
      label="Category"
      value={value}
      onChange={setValue}
      options={categoryOptions}
      placeholder="Select a category"
    />
  );
};

export const Required = () => {
  const [value, setValue] = useState('');
  return (
    <Select
      label="Category"
      value={value}
      onChange={setValue}
      options={categoryOptions}
      placeholder="Select a category"
      required
    />
  );
};

export const WithError = () => {
  const [value, setValue] = useState('');
  return (
    <Select
      label="Category"
      value={value}
      onChange={setValue}
      options={categoryOptions}
      placeholder="Select a category"
      error="Please select a category"
    />
  );
};

export const Disabled = () => {
  const [value, setValue] = useState('TOP');
  return (
    <Select
      label="Category"
      value={value}
      onChange={setValue}
      options={categoryOptions}
      disabled
    />
  );
};

export const WithSelectedValue = () => {
  const [value, setValue] = useState('SUMMER');
  return (
    <Select
      label="Season"
      value={value}
      onChange={setValue}
      options={seasonOptions}
    />
  );
};

export const AllStates = () => {
  const [value, setValue] = useState('');
  return (
    <Select
      label="Category"
      value={value}
      onChange={setValue}
      options={categoryOptions}
      placeholder="Select a category"
      required
      error="This field is required"
    />
  );
};

export const EmptyOptions = () => {
  const [value, setValue] = useState('');
  return (
    <Select
      label="Category"
      value={value}
      onChange={setValue}
      options={[]}
      placeholder="No options available"
    />
  );
};

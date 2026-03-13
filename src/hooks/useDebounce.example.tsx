/**
 * Example usage of useDebounce hook
 * 
 * This file demonstrates how to use the useDebounce hook for search input
 * and filter changes to avoid excessive API calls.
 */

import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

// Example 1: Search input with 300ms delay
export function SearchExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    // This will only run 300ms after the user stops typing
    if (debouncedQuery) {
      console.log('Fetching search results for:', debouncedQuery);
      // fetchSearchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search clothing items..."
    />
  );
}

// Example 2: Filter changes with custom delay
export function FilterExample() {
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  
  const debouncedCategory = useDebounce(category, 300);
  const debouncedColor = useDebounce(color, 300);

  useEffect(() => {
    // This will only run 300ms after the user stops changing filters
    console.log('Applying filters:', { debouncedCategory, debouncedColor });
    // applyFilters({ category: debouncedCategory, color: debouncedColor });
  }, [debouncedCategory, debouncedColor]);

  return (
    <div>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="TOP">Tops</option>
        <option value="BOTTOM">Bottoms</option>
      </select>
      
      <input
        type="text"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        placeholder="Filter by color..."
      />
    </div>
  );
}

// Example 3: Using with default delay
export function DefaultDelayExample() {
  const [value, setValue] = useState('');
  // Uses default 300ms delay
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    console.log('Debounced value:', debouncedValue);
  }, [debouncedValue]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

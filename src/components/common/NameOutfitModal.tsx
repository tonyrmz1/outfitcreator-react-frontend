import React, { useEffect, useRef, useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';

export interface NameOutfitModalProps {
  isOpen: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export const NameOutfitModal: React.FC<NameOutfitModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_LENGTH = 80;

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError(undefined);
      // Auto-focus input after the transition starts
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a name for this outfit.');
      inputRef.current?.focus();
      return;
    }
    onConfirm(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="outfit-modal-title"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl animate-slideIn overflow-hidden">
        {/* Teal accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary" />

        <div className="px-6 pt-5 pb-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-tertiary text-primary shrink-0">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c-1.2 0-2.4.6-3 1.5L3 9h18l-6-4.5A3.75 3.75 0 0012 3zM3 9v10a2 2 0 002 2h14a2 2 0 002-2V9"
                />
              </svg>
            </span>
            <div>
              <h2
                id="outfit-modal-title"
                className="text-base font-semibold text-gray-900 leading-tight"
              >
                Save outfit
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Give your new outfit a memorable name
              </p>
            </div>
          </div>

          {/* Name input */}
          <div className="mb-5">
            <Input
              ref={inputRef}
              label="Outfit name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value.slice(0, MAX_LENGTH));
                if (error) setError(undefined);
              }}
              placeholder="e.g. Summer casual look"
              error={error}
              id="outfit-name-input"
              name="outfitName"
              maxLength={MAX_LENGTH}
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {name.length}/{MAX_LENGTH}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              disabled={!name.trim()}
            >
              Save outfit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

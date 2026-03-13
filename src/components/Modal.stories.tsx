import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

/**
 * Modal Component Examples
 * 
 * This file demonstrates the various configurations of the Modal component.
 * It serves as both documentation and a visual reference for developers.
 */

// Wrapper component to handle modal state
const ModalWrapper = ({ 
  size = 'md', 
  title = 'Modal Title', 
  children 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl'; 
  title?: string; 
  children?: React.ReactNode 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        size={size}
      >
        {children || (
          <div>
            <p className="text-gray-700 mb-4">
              This is the modal content. You can put any content here.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export const ModalExamples = () => {
  return (
    <div className="p-8 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Default Modal</h2>
        <ModalWrapper />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Size Variants</h2>
        <div className="flex gap-4">
          <ModalWrapper size="sm" title="Small Modal" />
          <ModalWrapper size="md" title="Medium Modal" />
          <ModalWrapper size="lg" title="Large Modal" />
          <ModalWrapper size="xl" title="Extra Large Modal" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">With Form</h2>
        <ModalWrapper title="Create New Item">
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter description"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
              <Button type="submit">
                Save
              </Button>
            </div>
          </form>
        </ModalWrapper>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">With Long Content (Scrollable)</h2>
        <ModalWrapper title="Terms and Conditions">
          <div className="space-y-4 text-gray-700">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="secondary">
                Decline
              </Button>
              <Button>
                Accept
              </Button>
            </div>
          </div>
        </ModalWrapper>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Focus Trap Demo</h2>
        <ModalWrapper title="Focus Trap Demo">
          <div className="space-y-4">
            <p className="text-gray-700">
              Try pressing Tab to navigate through the focusable elements. The focus will stay trapped within the modal.
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="First input"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="text"
                placeholder="Second input"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="text"
                placeholder="Third input"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary">
                Cancel
              </Button>
              <Button>
                Submit
              </Button>
            </div>
          </div>
        </ModalWrapper>
      </section>
    </div>
  );
};

export default ModalExamples;

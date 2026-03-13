import React from 'react';
import { Button } from './Button';

/**
 * Button Component Examples
 * 
 * This file demonstrates the various configurations of the Button component.
 * It serves as both documentation and a visual reference for developers.
 */

export const ButtonExamples = () => {
  return (
    <div className="p-8 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Variants</h2>
        <div className="flex gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Sizes</h2>
        <div className="flex gap-4 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">States</h2>
        <div className="flex gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Full Width</h2>
        <Button fullWidth>Full Width Button</Button>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Button Types</h2>
        <div className="flex gap-4">
          <Button type="button">Button</Button>
          <Button type="submit">Submit</Button>
          <Button type="reset">Reset</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Combinations</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button variant="primary" size="lg" loading>
              Large Primary Loading
            </Button>
            <Button variant="danger" size="sm" disabled>
              Small Danger Disabled
            </Button>
          </div>
          <Button variant="secondary" fullWidth>
            Full Width Secondary
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ButtonExamples;

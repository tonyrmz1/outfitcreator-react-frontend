import { useState } from 'react';
import { Input } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
};

export const Default = () => {
  const [value, setValue] = useState('');
  return <Input label="Email" value={value} onChange={setValue} />;
};

export const WithPlaceholder = () => {
  const [value, setValue] = useState('');
  return (
    <Input
      label="Email"
      value={value}
      onChange={setValue}
      placeholder="Enter your email"
    />
  );
};

export const Required = () => {
  const [value, setValue] = useState('');
  return <Input label="Email" value={value} onChange={setValue} required />;
};

export const WithError = () => {
  const [value, setValue] = useState('invalid-email');
  return (
    <Input
      label="Email"
      value={value}
      onChange={setValue}
      error="Please enter a valid email address"
    />
  );
};

export const Disabled = () => {
  const [value, setValue] = useState('disabled@example.com');
  return <Input label="Email" value={value} onChange={setValue} disabled />;
};

export const Password = () => {
  const [value, setValue] = useState('');
  return (
    <Input
      label="Password"
      type="password"
      value={value}
      onChange={setValue}
      placeholder="Enter your password"
    />
  );
};

export const Email = () => {
  const [value, setValue] = useState('');
  return (
    <Input
      label="Email Address"
      type="email"
      value={value}
      onChange={setValue}
      placeholder="user@example.com"
    />
  );
};

export const Number = () => {
  const [value, setValue] = useState('');
  return (
    <Input
      label="Age"
      type="number"
      value={value}
      onChange={setValue}
      placeholder="Enter your age"
    />
  );
};

export const AllStates = () => {
  const [value, setValue] = useState('test@example.com');
  return (
    <Input
      label="Email"
      value={value}
      onChange={setValue}
      required
      error="This field is required"
    />
  );
};

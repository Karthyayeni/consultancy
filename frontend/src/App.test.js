import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

console.log(React);
function Simple() {
  return <div>Hello World</div>;
}

test('renders simple text', () => {
  render(<Simple />);
  const element = screen.getByText(/hello world/i);
  expect(element).toBeInTheDocument();
});

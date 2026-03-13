import { render, screen } from '@testing-library/react';
import App from './App';

test('renders grammar simplification tool title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Grammar Simplification Tool/i);
  expect(titleElement).toBeInTheDocument();
});
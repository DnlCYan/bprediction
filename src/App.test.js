import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText, getByRole } = render(<App />);
  expect(getByText(/Bitcoin Prediction/i)).toBeInTheDocument();
  expect(getByText(/Market Value/i)).toBeInTheDocument();
  expect(getByRole('heading', {  name: /your points:/i})).toBeInTheDocument();
});

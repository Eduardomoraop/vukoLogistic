import { render, screen } from '@testing-library/react';
import App from './App';

test('renders VukoLogistic ERP heading', () => {
  render(<App />);
  const heading = screen.getByText(/VukoLogistic ERP/i);
  expect(heading).toBeInTheDocument();
});

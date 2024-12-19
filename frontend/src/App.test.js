import { render, screen } from '@testing-library/react';
import EmployeeForm from './EmployeeForm';

test('renders learn react link', () => {
  render(<EmployeeForm />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

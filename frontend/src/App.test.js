import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import Header from './components/Header';

test('renders home page with welcome message', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
  const welcomeElement = screen.getByText(/Unlock Your Inner Innovator/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders header with login button when not authenticated', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
  const loginButton = screen.getByText(/Login/i);
  expect(loginButton).toBeInTheDocument();
});

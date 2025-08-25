import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './AuthContext';
import api from '../lib/api';

// Mock the api module
jest.mock('../lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Prevent retries in tests
    },
  },
});

const TestComponent = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <div>
          <span data-testid="user-display">{user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login('test@example.com', 'password')}>Login</button>
      )}
    </div>
  );
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{component}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    jest.clearAllMocks();
    localStorage.clear();
    queryClient.clear();
  });

  it('should allow a user to log in and display their username', async () => {
    // Arrange: Mock the API responses
    mockedApi.post.mockResolvedValueOnce({ data: { key: 'test_token' } });
    mockedApi.get.mockResolvedValueOnce({ data: { pk: 1, username: 'testuser', email: 'test@example.com' } });

    renderWithProviders(<TestComponent />);

    // Act: Simulate user clicking the login button
    fireEvent.click(screen.getByText('Login'));

    // Assert: Wait for the user's name to be displayed
    await waitFor(() => {
      expect(screen.getByTestId('user-display')).toHaveTextContent('testuser');
    });

    // Also assert that the token was stored
    expect(localStorage.getItem('ib_token')).toBe('test_token');
  });

  it('should log a user out', async () => {
    // Arrange: Start with a logged-in user
    localStorage.setItem('ib_token', 'test_token');
    mockedApi.get.mockResolvedValueOnce({ data: { pk: 1, username: 'testuser', email: 'test@example.com' } });

    renderWithProviders(<TestComponent />);

    // Wait for the user to be logged in
    await waitFor(() => {
        expect(screen.getByTestId('user-display')).toBeInTheDocument();
    });

    // Act: Click the logout button
    fireEvent.click(screen.getByText('Logout'));

    // Assert: The login button should reappear
    await waitFor(() => {
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    // Also assert that the token was removed
    expect(localStorage.getItem('ib_token')).toBeNull();
  });
});

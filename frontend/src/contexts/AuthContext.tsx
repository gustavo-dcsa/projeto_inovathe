import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

// Define the shape of the user object and the context
interface User {
  pk: number;
  username: string;
  email: string;
  full_name?: string;
  role?: 'admin' | 'member'; // Add role property
  // Add other user properties as needed from the /api/users/me/ endpoint
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Function to fetch the user profile
const fetchUserProfile = async (): Promise<User> => {
  const { data } = await api.get('/users/me/');
  return data;
};

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ib_token'));

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('ib_token');
    // Remove user profile data from the cache
    queryClient.removeQueries({ queryKey: ['userProfile'] });
  }, [queryClient]);

  // Use React Query to fetch the user profile
  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    enabled: !!token, // Only run the query if the token exists
    retry: 1, // Retry once on failure
  });

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    // If the query fails (e.g., token is invalid), log the user out
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password });
    const newToken = response.data.key;
    localStorage.setItem('ib_token', newToken);
    setToken(newToken);
    // Invalidate any stale queries and let RQ refetch user profile
    await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
  };

  // Set up listener for 401 errors from the global api instance
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('api:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('api:unauthorized', handleUnauthorized);
    };
  }, [logout]);


  const value = {
    user: user ?? null,
    token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

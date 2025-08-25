import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import api from '../api/api';
import { components } from '../types/api-types';

type User = components['schemas']['UserDetails'];

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ib_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      if (token) {
        api.defaults.headers['Authorization'] = `Token ${token}`;
        try {
          const { data: userData } = await api.get<User>('/auth/user/');
          setUser(userData);
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('ib_token');
          setToken(null);
          setUser(null);
          delete api.defaults.headers['Authorization'];
        }
      }
      setIsLoading(false);
    };

    loadUserFromToken();
  }, [token]);

  const login = async (username, password) => {
    const { data } = await api.post<{ key: string }>('/auth/login/', { username, password });
    const newToken = data.key;
    localStorage.setItem('ib_token', newToken);
    api.defaults.headers['Authorization'] = `Token ${newToken}`;
    // Fetch user data after setting the new token
    const { data: userData } = await api.get<User>('/auth/user/');
    setUser(userData);
    setToken(newToken); // Set token last to trigger useEffect if needed
  };

  const logout = () => {
    // We don't strictly need to wait for the logout API call to finish
    // to clear the frontend state. This makes the UI feel faster.
    localStorage.removeItem('ib_token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers['Authorization'];
    // Fire and forget the API call
    api.post('/auth/logout/').catch(err => {
      console.error("Logout API call failed, but user is logged out on the client.", err);
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        try {
          const response = await authService.getUser();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          logout();
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const newToken = response.data.key;
    setToken(newToken);
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Token ${newToken}`;
    const userResponse = await authService.getUser();
    setUser(userResponse.data);
    return response;
  };

  const signup = async (username, email, password, password2) => {
    const response = await authService.signup(username, email, password, password2);
    const newToken = response.data.key;
    setToken(newToken);
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Token ${newToken}`;
    const userResponse = await authService.getUser();
    setUser(userResponse.data);
    return response;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const value = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

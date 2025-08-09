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
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      // Here you would typically fetch the user profile
      // For now, we'll just assume the user is logged in if there's a token.
      // A proper implementation would verify the token with the backend.
      setUser({ username: 'User' }); // Placeholder user
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const newToken = response.data.key;
    setToken(newToken);
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Token ${newToken}`;
    setUser({ username: 'User' }); // Placeholder user
    return response;
  };

  const signup = async (username, email, password, password2) => {
    const response = await authService.signup(username, email, password, password2);
    const newToken = response.data.key;
    setToken(newToken);
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Token ${newToken}`;
    setUser({ username: 'User' }); // Placeholder user
    return response;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Axios interceptor for handling 401 errors
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

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

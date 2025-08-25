import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: `${API_BASE}/api/`,
  timeout: Number(process.env.REACT_APP_API_TIMEOUT) || 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token will be injected by an interceptor from the auth context
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      // The strategy is to clear the token and redirect to login (no refresh attempt)
      // Dispatch a global event or call the logout function from AuthContext
      window.dispatchEvent(new Event('api:unauthorized'));
    }
    return Promise.reject(err);
  }
);

export default api;

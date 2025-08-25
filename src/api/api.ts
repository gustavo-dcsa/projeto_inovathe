import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL ?? 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${baseURL}/api/`,
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    // The brief specifies using localStorage for the token.
    const token = localStorage.getItem('ib_token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // The brief asks to normalize array responses to match paginated responses.
    // This can simplify data handling in components.
    if (Array.isArray(response.data)) {
      response.data = { results: response.data, count: response.data.length, next: null, previous: null };
    }
    return response;
  },
  (error) => {
    // Global handling for 401 Unauthorized errors.
    if (error.response?.status === 401) {
      localStorage.removeItem('ib_token');
      // Redirect to login page. Using replace to prevent going back to the unauthorized page.
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;

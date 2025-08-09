import axios from 'axios';

const API_URL = '/api/auth/';

const signup = (username, email, password, password2) => {
  return axios.post(API_URL + 'registration/', {
    username,
    email,
    password,
    password2,
  });
};

const login = (email, password) => {
  return axios.post(API_URL + 'login/', {
    email,
    password,
  });
};

const logout = () => {
  // We'll need to handle token removal on the client side
  return axios.post(API_URL + 'logout/');
};

const authService = {
  signup,
  login,
  logout,
};

export default authService;

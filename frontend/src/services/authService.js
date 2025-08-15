import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/auth/';

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

const getUser = () => {
  return axios.get(API_URL + 'user/');
};

const authService = {
  signup,
  login,
  logout,
  getUser,
};

export default authService;

import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const loginWithGoogle = async (token, name, email) => {
  const response = await api.post('/auth/google', { token, name, email });
  return response.data;
};

export const verifyRegister = async (email, otp) => {
  const response = await api.post('/auth/register/verify', { email, otp });
  return response.data;
};

export const verifyLogin = async (email, otp) => {
  const response = await api.post('/auth/login/verify', { email, otp });
  return response.data;
};

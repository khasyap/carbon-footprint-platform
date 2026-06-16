import api from './api';

export const logActivity = async (activityData) => {
  const response = await api.post('/carbon/log', activityData);
  return response.data;
};

export const getLogs = async () => {
  const response = await api.get('/carbon/logs');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/carbon/stats');
  return response.data;
};

export const getDashboard = async () => {
  const response = await api.get('/reports/dashboard');
  return response.data;
};

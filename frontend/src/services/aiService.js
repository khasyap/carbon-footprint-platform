import api from './api';

export const getRecommendations = async () => {
  const response = await api.post('/ai/recommendations');
  return response.data;
};

import api from './api';

export const getChallenges = async () => {
  const response = await api.get('/challenges');
  return response.data;
};

export const joinChallenge = async (id) => {
  const response = await api.post(`/challenges/${id}/join`);
  return response.data;
};

export const completeChallenge = async (id) => {
  const response = await api.post(`/challenges/${id}/complete`);
  return response.data;
};

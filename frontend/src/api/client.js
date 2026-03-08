import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

export async function createProfile(data) {
  const response = await api.post('/profiles', data);
  return response.data;
}

export async function getProfile(userId) {
  const response = await api.get(`/profiles/${userId}`);
  return response.data;
}

export async function getMatches(userId, topK = 10) {
  const response = await api.get(`/matches/${userId}`, {
    params: { top_k: topK },
  });
  return response.data;
}

export default api;

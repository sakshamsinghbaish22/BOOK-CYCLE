import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  async getUserProfile(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async getUserBooks(userId) {
    const response = await api.get(`/users/${userId}/books`);
    return response.data;
  }
};

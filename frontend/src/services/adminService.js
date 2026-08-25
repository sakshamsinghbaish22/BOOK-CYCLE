import api from './api';

export const adminService = {
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async manageUser(userId, data) {
    const response = await api.put(`/admin/users/${userId}/manage`, data);
    return response.data;
  },

  async getAllListings() {
    const response = await api.get('/admin/listings');
    return response.data;
  }
};

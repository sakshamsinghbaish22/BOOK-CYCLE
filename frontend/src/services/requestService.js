import api from './api';

export const requestService = {
  async createRequest(data) {
    const response = await api.post('/requests', data);
    return response.data;
  },

  async getSentRequests() {
    const response = await api.get('/requests/sent');
    return response.data;
  },

  async getReceivedRequests() {
    const response = await api.get('/requests/received');
    return response.data;
  },

  async updateRequestStatus(reqId, status, notes = '') {
    const response = await api.put(`/requests/${reqId}/status`, { status, notes });
    return response.data;
  }
};

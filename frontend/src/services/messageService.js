import api from './api';

export const messageService = {
  async sendMessage(data) {
    const response = await api.post('/messages', data);
    return response.data;
  },

  async getThreads() {
    const response = await api.get('/messages/threads');
    return response.data;
  },

  async getMessagesWithUser(userId) {
    const response = await api.get(`/messages/user/${userId}`);
    return response.data;
  }
};

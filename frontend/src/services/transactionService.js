import api from './api';

export const transactionService = {
  async getMyTransactions() {
    const response = await api.get('/transactions');
    return response.data;
  },

  async updateTransactionStatus(txId, status) {
    const response = await api.put(`/transactions/${txId}/status`, { status });
    return response.data;
  }
};

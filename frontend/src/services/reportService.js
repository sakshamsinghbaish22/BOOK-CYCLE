import api from './api';

export const reportService = {
  async submitReport(data) {
    const response = await api.post('/reports', data);
    return response.data;
  },

  async getReports() {
    const response = await api.get('/reports');
    return response.data;
  },

  async resolveReport(reportId, data) {
    const response = await api.put(`/reports/${reportId}/resolve`, data);
    return response.data;
  }
};

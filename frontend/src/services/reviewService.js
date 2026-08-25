import api from './api';

export const reviewService = {
  async createReview(data) {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  async getUserReviews(userId) {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  }
};

import api from './api';

export const bookService = {
  async getBooks(params = {}) {
    const response = await api.get('/books', { params });
    return response.data;
  },

  async getBookById(id) {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/books/categories');
    return response.data;
  },

  async createBook(bookData) {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  async updateBook(id, bookData) {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  async deleteBook(id) {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/books/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Wishlist operations
  async getWishlist() {
    const response = await api.get('/wishlist');
    return response.data;
  },

  async addToWishlist(bookId) {
    const response = await api.post(`/wishlist/${bookId}`);
    return response.data;
  },

  async removeFromWishlist(bookId) {
    const response = await api.delete(`/wishlist/${bookId}`);
    return response.data;
  },

  async checkWishlistStatus(bookId) {
    const response = await api.get(`/wishlist/check/${bookId}`);
    return response.data;
  }
};

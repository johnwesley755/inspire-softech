import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products?featured=true');
    return response.data;
  },

  searchProducts: async (query) => {
    const response = await api.get(`/products/search?q=${query}`);
    return response.data;
  },
};

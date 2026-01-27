import api from './api';

export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

import api from './api';

export const adminAuthService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token && response.data.user.role === 'admin') {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error('Not authorized as admin');
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  getStoredUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },
};

export const productService = {
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export const orderService = {
  getAllOrders: async (params) => {
    const response = await api.get('/orders/admin/all', { params });
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};

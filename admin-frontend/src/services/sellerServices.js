import api from './api';

// Seller Services
export const sellerService = {
  // Get my seller profile
  getMyProfile: async () => {
    const response = await api.get('/sellers/me/profile');
    return response.data;
  },

  // Update my profile
  updateMyProfile: async (profileData) => {
    const response = await api.put('/sellers/me/profile', profileData);
    return response.data;
  },

  // Get my dashboard stats
  getMyStats: async () => {
    const response = await api.get('/sellers/me/stats');
    return response.data;
  },

  // Get my revenue analytics
  getMyRevenue: async () => {
    const response = await api.get('/sellers/me/revenue');
    return response.data;
  },

  // Register as seller
  register: async (sellerData) => {
    const response = await api.post('/sellers/register', sellerData);
    return response.data;
  },
};

// Product Services (seller-specific)
export const productService = {
  // Get MY products only
  getMyProducts: async (params) => {
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

// Order Services (seller-specific)
export const orderService = {
  // Get MY orders only
  getMyOrders: async (params) => {
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

// Auth Service (updated for seller)
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('sellerToken', response.data.token);
      localStorage.setItem('sellerUser', JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error('Login failed');
  },

  logout: () => {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerUser');
  },

  getStoredUser: () => {
    const user = localStorage.getItem('sellerUser');
    return user ? JSON.parse(user) : null;
  },
};

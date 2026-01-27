import api from './api';

// Auth Service
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token && response.data.user.role === 'super_admin') {
      localStorage.setItem('superAdminToken', response.data.token);
      localStorage.setItem('superAdminUser', JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error('Not authorized as super admin');
  },

  logout: () => {
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdminUser');
  },

  getStoredUser: () => {
    const user = localStorage.getItem('superAdminUser');
    return user ? JSON.parse(user) : null;
  },
};

// Super Admin Services
export const superAdminService = {
  // Get all sellers
  getAllSellers: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/super-admin/sellers', { params });
    return response.data;
  },

  // Approve seller
  approveSeller: async (id) => {
    const response = await api.put(`/super-admin/sellers/${id}/approve`);
    return response.data;
  },

  // Reject seller
  rejectSeller: async (id) => {
    const response = await api.put(`/super-admin/sellers/${id}/reject`);
    return response.data;
  },

  // Suspend seller
  suspendSeller: async (id) => {
    const response = await api.put(`/super-admin/sellers/${id}/suspend`);
    return response.data;
  },

  // Update commission
  updateCommission: async (id, commission) => {
    const response = await api.put(`/super-admin/sellers/${id}/commission`, { commission });
    return response.data;
  },

  // Get platform stats
  getPlatformStats: async () => {
    const response = await api.get('/super-admin/stats');
    return response.data;
  },
};

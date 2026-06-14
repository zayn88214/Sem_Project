import apiClient from './api';

export const authService = {
  register: async (name, email, password) => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    const { tokens, user } = response.data;
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  refresh: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data.user;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put('/users/profile', userData);
    return response.data.user;
  },

  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    const response = await apiClient.post('/users/change-password', {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  deleteAccount: async (password) => {
    const response = await apiClient.delete('/users/account', {
      data: { password },
    });
    return response.data;
  },
};

export const diseaseService = {
  predictDisease: async (imageUrl) => {
    const response = await apiClient.post('/disease/predict', {
      imageUrl,
    });
    return response.data.prediction;
  },

  predictDiseaseFile: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/disease/predict-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.prediction;
  },

  predictDiseaseText: async (symptoms) => {
    const response = await apiClient.post('/disease/predict-text', {
      symptoms,
    });
    return response.data.prediction;
  },

  getPredictionHistory: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/disease/history', {
      params: { page, limit },
    });
    return response.data;
  },

  getPredictionById: async (id) => {
    const response = await apiClient.get(`/disease/${id}`);
    return response.data.prediction;
  },

  deletePrediction: async (id) => {
    const response = await apiClient.delete(`/disease/${id}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get('/disease/statistics');
    return response.data.statistics;
  },
};

export const cropService = {
  recommendCrop: async (N, P, K, temperature, humidity, pH, rainfall) => {
    const response = await apiClient.post('/crop/recommend', {
      N,
      P,
      K,
      temperature,
      humidity,
      pH,
      rainfall,
    });
    return response.data.recommendation;
  },

  getRecommendationHistory: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/crop/history', {
      params: { page, limit },
    });
    return response.data;
  },

  getRecommendationById: async (id) => {
    const response = await apiClient.get(`/crop/${id}`);
    return response.data.recommendation;
  },

  deleteRecommendation: async (id) => {
    const response = await apiClient.delete(`/crop/${id}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get('/crop/statistics');
    return response.data.statistics;
  },
};

export const adminService = {
  getAllUsers: async (page = 1, limit = 10, role = null, search = null) => {
    const response = await apiClient.get('/admin/users', {
      params: { page, limit, ...(role && { role }), ...(search && { search }) },
    });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data.user;
  },

  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response.data.user;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard/stats');
    return response.data.stats;
  },

  getPredictionStats: async () => {
    const response = await apiClient.get('/admin/predictions/stats');
    return response.data.stats;
  },

  getActivityLogs: async (page = 1, limit = 20, action = null, userId = null) => {
    const response = await apiClient.get('/admin/logs', {
      params: { page, limit, ...(action && { action }), ...(userId && { userId }) },
    });
    return response.data;
  },
};

// src/services/api.js
import axios from 'axios';

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });
          
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, logout the user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper methods
const apiService = {
  setAuthToken: (token) => {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  
  clearAuthToken: () => {
    delete api.defaults.headers.common.Authorization;
  },
  
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // AI-specific endpoints
  useAiTokens: async (feature, amount) => {
    try {
      const response = await api.post('/ai/use-tokens', { feature, amount });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Product research endpoints
  searchProducts: async (query, filters = {}) => {
    try {
      const response = await api.post('/products/search', { query, ...filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getTrendingProducts: async (category = 'all', limit = 10) => {
    try {
      const response = await api.get(`/products/trending?category=${category}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Supplier endpoints
  getSuppliers: async (filters = {}) => {
    try {
      const response = await api.get('/suppliers', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  scoreSupplier: async (supplierId) => {
    try {
      const response = await api.get(`/suppliers/${supplierId}/score`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Listing endpoints
  getListings: async (filters = {}) => {
    try {
      const response = await api.get('/listings', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createListing: async (listingData) => {
    try {
      const response = await api.post('/listings', listingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateListing: async (listingId, listingData) => {
    try {
      const response = await api.put(`/listings/${listingId}`, listingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteListing: async (listingId) => {
    try {
      const response = await api.delete(`/listings/${listingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Analytics endpoints
  getDashboardStats: async () => {
    try {
      const response = await api.get('/auth/analytics/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getRevenueStats: async (period = 'month') => {
    try {
      const response = await api.get(`/analytics/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;

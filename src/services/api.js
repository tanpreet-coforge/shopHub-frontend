import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

// Product endpoints
export const productAPI = {
  getAllProducts: (params) => apiClient.get('/products', { params }),
  getProductById: (id) => apiClient.get(`/products/${id}`),
  searchProducts: (query) => apiClient.get('/products/search', { params: { q: query } }),
  getCategories: () => apiClient.get('/products/categories'),
  addReview: (productId, data) => apiClient.post(`/products/${productId}/reviews`, data),
};

// Cart endpoints
export const cartAPI = {
  getCart: () => apiClient.get('/cart'),
  addToCart: (data) => apiClient.post('/cart/add', data),
  updateCartItem: (id, data) => apiClient.put(`/cart/update/${id}`, data),
  removeFromCart: (id) => apiClient.delete(`/cart/remove/${id}`),
  clearCart: () => apiClient.post('/cart/clear'),
};

// Order endpoints
export const orderAPI = {
  getUserOrders: () => apiClient.get('/orders'),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  createOrder: (data) => apiClient.post('/orders', data),
  updateOrderStatus: (id, data) => apiClient.put(`/orders/${id}/status`, data),
  cancelOrder: (id) => apiClient.post(`/orders/${id}/cancel`),
};

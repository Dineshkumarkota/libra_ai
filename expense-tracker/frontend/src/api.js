import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
};

// Expense endpoints
export const expenseAPI = {
  createExpense: (title, amount, category, date, description) =>
    api.post('/expenses', { title, amount, category, date, description }),
  getExpenses: (startDate, endDate, category) =>
    api.get('/expenses', { params: { startDate, endDate, category } }),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  getStats: (startDate, endDate) =>
    api.get('/expenses/stats', { params: { startDate, endDate } }),
};

export default api;

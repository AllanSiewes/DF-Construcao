import axios from 'axios';
import { storage } from '../utils/storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? 'http://192.168.4.29:3001/api' : 'https://api.dfconstrucoes.com.br/api');

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getItem('df_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.removeItem('df_token');
      await storage.removeItem('df_user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  googleAuth: (id_token: string) =>
    api.post('/auth/google', { id_token }),
  googleAuthCode: (code: string, codeVerifier?: string, redirectUri?: string) =>
    api.post('/auth/google/code', { code, codeVerifier, redirectUri }),
  me: () => api.get('/auth/me'),
  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

export const projectService = {
  list: (params?: Record<string, any>) => api.get('/projects', { params }),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: Record<string, any>) => api.post('/projects', data),
  update: (id: string, data: Record<string, any>) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const transactionService = {
  list: (params?: Record<string, any>) => api.get('/transactions', { params }),
  get: (id: string) => api.get(`/transactions/${id}`),
  create: (data: Record<string, any>) => api.post('/transactions', data),
  update: (id: string, data: Record<string, any>) => api.put(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

export const reportService = {
  dashboard: () => api.get('/reports/dashboard'),
  cashflow: (months?: number) => api.get('/reports/cashflow', { params: { months } }),
  byCategory: (params?: Record<string, any>) => api.get('/reports/by-category', { params }),
};

export const categoryService = {
  list: (params?: Record<string, any>) => api.get('/categories', { params }),
  create: (data: Record<string, any>) => api.post('/categories', data),
  update: (id: string, data: Record<string, any>) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

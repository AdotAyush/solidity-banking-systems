import { create } from 'zustand';
import api from '../utils/api.js';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        loading: false
      });
      
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Login failed',
        loading: false
      });
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  },

  register: async (email, password, role = 'customer') => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', { email, password, role });
      const { user, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        loading: false
      });
      
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Registration failed',
        loading: false
      });
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false
      });
    }
  },

  setUser: (user) => set({ user }),

  clearError: () => set({ error: null })
}));

export default useAuthStore;


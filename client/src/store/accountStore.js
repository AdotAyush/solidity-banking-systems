import { create } from 'zustand';
import api from '../utils/api.js';

const useAccountStore = create((set) => ({
  account: null,
  loading: false,
  error: null,

  fetchAccount: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/accounts/me');
      set({ account: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch account',
        loading: false
      });
      throw error;
    }
  },

  updateWalletAddress: async (walletAddress) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put('/accounts/wallet', { walletAddress });
      set({ loading: false });
      await useAccountStore.getState().fetchAccount();
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to update wallet address',
        loading: false
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

export default useAccountStore;


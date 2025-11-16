import { create } from 'zustand';
import api from '../utils/api.js';

const useTransactionStore = create((set) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async (limit = 50) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/transactions?limit=${limit}`);
      set({ transactions: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Failed to fetch transactions',
        loading: false
      });
      throw error;
    }
  },

  createDeposit: async (amount, source = 'offchain') => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/transactions/deposit', { amount, source });
      set({ loading: false });
      await useTransactionStore.getState().fetchTransactions();
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Deposit failed',
        loading: false
      });
      throw error;
    }
  },

  createWithdraw: async (amount, source = 'offchain') => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/transactions/withdraw', { amount, source });
      set({ loading: false });
      await useTransactionStore.getState().fetchTransactions();
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Withdrawal failed',
        loading: false
      });
      throw error;
    }
  },

  createTransfer: async (recipientId, amount, source = 'offchain') => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/transactions/transfer', {
        recipientId,
        amount,
        source
      });
      set({ loading: false });
      await useTransactionStore.getState().fetchTransactions();
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Transfer failed',
        loading: false
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

export default useTransactionStore;


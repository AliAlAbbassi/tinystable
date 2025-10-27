import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const secureStorage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

interface WalletState {
  address: string | null;
  privateKey: string | null;
  balance: string;
  isLoading: boolean;
  showPrivateKey: boolean;

  setWallet: (address: string, privateKey: string) => void;
  setBalance: (balance: string) => void;
  togglePrivateKey: () => void;
  setLoading: (loading: boolean) => void;
  clearWallet: () => void;
  loadWallet: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  privateKey: null,
  balance: '0.00',
  isLoading: false,
  showPrivateKey: false,

  setWallet: (address, privateKey) => {
    set({ address, privateKey });
    secureStorage.setItem('wallet_data', JSON.stringify({ address, privateKey })).catch(error => {
      console.warn('Failed to store wallet data securely:', error);
    });
  },

  setBalance: (balance) => set({ balance }),

  togglePrivateKey: () => set((state) => ({ showPrivateKey: !state.showPrivateKey })),

  setLoading: (isLoading) => set({ isLoading }),

  clearWallet: () => {
    set({ address: null, privateKey: null, balance: '0.00', showPrivateKey: false });
    secureStorage.removeItem('wallet_data').catch(error => {
      console.warn('Failed to remove wallet data:', error);
    });
  },

  loadWallet: async () => {
    try {
      const walletData = await secureStorage.getItem('wallet_data');
      if (walletData) {
        const { address, privateKey } = JSON.parse(walletData);
        set({ address, privateKey });
      }
    } catch (error) {
      console.warn('Failed to load wallet data:', error);
    }
  },
}));
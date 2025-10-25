import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

interface WalletState {
  address: string | null;
  privateKey: string | null;
  balance: string;
  isLoading: boolean;
  showPrivateKey: boolean;

  // Actions
  setWallet: (address: string, privateKey: string) => void;
  setBalance: (balance: string) => void;
  togglePrivateKey: () => void;
  setLoading: (loading: boolean) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      address: null,
      privateKey: null,
      balance: '0.00',
      isLoading: false,
      showPrivateKey: false,

      setWallet: (address, privateKey) => {
        set({ address, privateKey });
        // Store securely in SecureStore
        SecureStore.setItemAsync('wallet_data', JSON.stringify({ address, privateKey }));
      },

      setBalance: (balance) => set({ balance }),

      togglePrivateKey: () => set((state) => ({ showPrivateKey: !state.showPrivateKey })),

      setLoading: (isLoading) => set({ isLoading }),

      clearWallet: () => {
        set({ address: null, privateKey: null, balance: '0.00', showPrivateKey: false });
        SecureStore.deleteItemAsync('wallet_data');
      },
    }),
    {
      name: 'wallet-storage',
      // Only persist non-sensitive data
      partialize: (state) => ({
        address: state.address,
        balance: state.balance,
        showPrivateKey: false // Never persist this
      }),
    }
  )
);
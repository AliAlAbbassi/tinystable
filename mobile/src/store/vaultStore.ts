import { create } from 'zustand';

interface VaultState {
  apy: string;
  tvl: string;
  userCount: string;
  vaultBalance: string;
  isLoading: boolean;

  // Actions
  setApy: (apy: string) => void;
  setTvl: (tvl: string) => void;
  setUserCount: (count: string) => void;
  setVaultBalance: (balance: string) => void;
  setLoading: (loading: boolean) => void;
  fetchVaultData: () => Promise<void>;
}

export const useVaultStore = create<VaultState>()((set, get) => ({
  apy: '4.2',
  tvl: '$0.00',
  userCount: '0',
  vaultBalance: '0.00',
  isLoading: false,

  setApy: (apy) => set({ apy }),
  setTvl: (tvl) => set({ tvl }),
  setUserCount: (userCount) => set({ userCount }),
  setVaultBalance: (vaultBalance) => set({ vaultBalance }),
  setLoading: (isLoading) => set({ isLoading }),

  fetchVaultData: async () => {
    set({ isLoading: true });
    try {
      // TODO: Fetch from backend API
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 1000));

      set({
        apy: '4.2',
        tvl: '$0.00',
        userCount: '0',
        vaultBalance: '0.00',
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch vault data:', error);
      set({ isLoading: false });
    }
  },
}));
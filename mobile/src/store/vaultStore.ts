import { create } from 'zustand';
import { getVaultStats, getUserBalance, getCurrentApy } from '../services/apiService';

interface VaultState {
  apy: string;
  tvl: string;
  userCount: string;
  vaultBalance: string;
  rawVaultBalance: string;
  isLoading: boolean;

  // Actions
  setApy: (apy: string) => void;
  setTvl: (tvl: string) => void;
  setUserCount: (count: string) => void;
  setVaultBalance: (balance: string) => void;
  setRawVaultBalance: (balance: string) => void;
  setLoading: (loading: boolean) => void;
  fetchVaultData: () => Promise<void>;
}

export const useVaultStore = create<VaultState>()((set, get) => ({
  apy: '4.2',
  tvl: '$0.00',
  userCount: '0',
  vaultBalance: '0.00',
  rawVaultBalance: '0',
  isLoading: false,

  setApy: (apy) => set({ apy }),
  setTvl: (tvl) => set({ tvl }),
  setUserCount: (userCount) => set({ userCount }),
  setVaultBalance: (vaultBalance) => set({ vaultBalance }),
  setRawVaultBalance: (rawVaultBalance) => set({ rawVaultBalance }),
  setLoading: (isLoading) => set({ isLoading }),

  fetchVaultData: async () => {
    set({ isLoading: true });
    try {
      const [vaultStats, apyData] = await Promise.all([
        getVaultStats(),
        getCurrentApy()
      ]);

      set({
        apy: apyData.apy || '4.2',
        tvl: vaultStats.tvl || '$0.00',
        userCount: vaultStats.userCount || '0',
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch vault data:', error);
      set({
        apy: '4.2',
        tvl: '$0.00',
        userCount: '0',
        isLoading: false,
      });
    }
  },
}));
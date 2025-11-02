import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { getVaultStats } from '../stats';
import * as blockchain from '../../blockchain';
import * as coingecko from '../../external/coingecko';
import * as defillama from '../../external/defillama';
import { parseEther } from 'viem';
import { cache } from '../../cache';

vi.mock('../../blockchain', () => ({
  publicClient: {
    readContract: vi.fn(),
  },
  CONTRACTS: {
    TINY_VAULT: '0x678282d82ccc897b2ae38f328b53c3bf5a594e13',
  },
  TINY_VAULT_ABI: [],
}));

vi.mock('../../external/coingecko', () => ({
  getEthPrice: vi.fn(),
}));

vi.mock('../../external/defillama', () => ({
  getAaveTvl: vi.fn(),
}));

const mockPublicClient = blockchain.publicClient as any;
const mockGetEthPrice = coingecko.getEthPrice as Mock;
const mockGetAaveTvl = defillama.getAaveTvl as Mock;

describe('Vault Stats Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cache.flushAll();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getVaultStats', () => {
    it('should fetch vault stats successfully', async () => {
      mockPublicClient.readContract
        .mockResolvedValueOnce(parseEther('10.5')) // totalAssets
        .mockResolvedValueOnce(parseEther('10.0')) // totalSupply
        .mockResolvedValueOnce(42n); // apy

      mockGetEthPrice.mockResolvedValue(1500);
      mockGetAaveTvl.mockResolvedValue(1000000000);

      const result = await getVaultStats();

      expect(result).toEqual({
        totalAssets: '10.500000',
        totalSupply: '10.000000',
        apy: 42,
        tvl: '$15750.00',
        userCount: '$1.0B',
        lastUpdated: expect.any(String)
      });
    });

    it('should return mock data when vault not configured', async () => {
      const originalContracts = blockchain.CONTRACTS;
      (blockchain as any).CONTRACTS = { ...originalContracts, TINY_VAULT: undefined };

      const result = await getVaultStats();

      expect(result).toEqual({
        totalAssets: '0.0',
        totalSupply: '0.0',
        apy: 4.2,
        tvl: '$0.00',
        userCount: '0',
        lastUpdated: expect.any(String)
      });

      (blockchain as any).CONTRACTS = originalContracts;
    });

    it('should handle errors and throw', async () => {
      mockPublicClient.readContract.mockRejectedValue(new Error('Network error'));

      await expect(getVaultStats()).rejects.toThrow('Network error');
    });
  });
});

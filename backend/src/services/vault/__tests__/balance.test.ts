import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { getUserBalance } from '../balance';
import * as blockchain from '../../blockchain';
import { parseEther, isAddress } from 'viem';
import { cache } from '../../cache';

vi.mock('../../blockchain', () => ({
  publicClient: {
    readContract: vi.fn(),
    multicall: vi.fn(),
  },
  CONTRACTS: {
    TINY_VAULT: '0x678282d82ccc897b2ae38f328b53c3bf5a594e13',
  },
  TINY_VAULT_ABI: [],
}));

vi.mock('viem', async () => {
  const actual = await vi.importActual('viem');
  return {
    ...actual,
    isAddress: vi.fn(),
  };
});

const mockPublicClient = blockchain.publicClient as any;
const mockIsAddress = isAddress as unknown as Mock;

describe('Vault Balance Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAddress.mockReturnValue(true);
    cache.flushAll();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getUserBalance', () => {
    it('should fetch user balance successfully', async () => {
      const userAddress = '0x1234567890123456789012345678901234567890';

      mockPublicClient.multicall.mockResolvedValue([
        { result: parseEther('5.0') }, // getUserBalance
        { result: parseEther('4.8') }, // balanceOf (shares)
        { result: parseEther('0.2') }, // getUserYield
        { result: parseEther('5.0') }  // userDeposits
      ]);

      const result = await getUserBalance(userAddress);

      expect(result).toEqual({
        address: userAddress,
        balance: '5',
        shares: '4.8',
        yield: '0.2',
        depositedAmount: '5',
        lastUpdated: expect.any(String)
      });
    });

    it('should throw error for invalid address', async () => {
      mockIsAddress.mockReturnValue(false);

      await expect(getUserBalance('invalid')).rejects.toThrow('Invalid Ethereum address');
    });

    it('should throw error when vault not configured', async () => {
      const originalContracts = blockchain.CONTRACTS;
      (blockchain as any).CONTRACTS = { ...originalContracts, TINY_VAULT: undefined };

      await expect(getUserBalance('0x1234567890123456789012345678901234567890'))
        .rejects.toThrow('TINY_VAULT_ADDRESS not configured');

      (blockchain as any).CONTRACTS = originalContracts;
    });
  });
});

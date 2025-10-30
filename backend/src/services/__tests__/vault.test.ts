import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { formatEther, parseEther, isAddress } from 'viem';
import { getVaultStats, getUserBalance, deposit, withdraw, getCurrentBlock } from '../vault';
import * as blockchain from '../blockchain';

vi.mock('../blockchain', () => ({
  publicClient: {
    readContract: vi.fn(),
    getBalance: vi.fn(),
    waitForTransactionReceipt: vi.fn(),
    getBlockNumber: vi.fn(),
  },
  CONTRACTS: {
    TINY_VAULT: '0x678282d82ccc897b2ae38f328b53c3bf5a594e13',
    WETH: '0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c',
    AAVE_POOL: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951'
  },
  TINY_VAULT_ABI: [],
  createWalletFromPrivateKey: vi.fn(),
}));

vi.mock('viem', async () => {
  const actual = await vi.importActual('viem');
  return {
    ...actual,
    isAddress: vi.fn(),
  };
});

const mockPublicClient = blockchain.publicClient as any;
const mockCreateWallet = blockchain.createWalletFromPrivateKey as Mock;
const mockIsAddress = isAddress as unknown as Mock;

describe('Vault Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAddress.mockReturnValue(true);
  });

  describe('getVaultStats', () => {
    it('should fetch vault stats successfully', async () => {
      mockPublicClient.readContract
        .mockResolvedValueOnce(parseEther('10.5')) // totalAssets
        .mockResolvedValueOnce(parseEther('10.0')) // totalSupply
        .mockResolvedValueOnce(42n); // apy

      const result = await getVaultStats();

      expect(result).toEqual({
        totalAssets: '10.5',
        totalSupply: '10.0',
        apy: 42,
        tvl: '10.5',
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

  describe('getUserBalance', () => {
    it('should fetch user balance successfully', async () => {
      const userAddress = '0x1234567890123456789012345678901234567890';

      mockPublicClient.readContract
        .mockResolvedValueOnce(parseEther('5.0')) // getUserBalance
        .mockResolvedValueOnce(parseEther('4.8')) // balanceOf (shares)
        .mockResolvedValueOnce(parseEther('0.2')) // getUserYield
        .mockResolvedValueOnce(parseEther('5.0')); // userDeposits

      const result = await getUserBalance(userAddress);

      expect(result).toEqual({
        address: userAddress,
        balance: '5.0',
        shares: '4.8',
        yield: '0.2',
        depositedAmount: '5.0',
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

  describe('deposit', () => {
    const userAddress = '0x1234567890123456789012345678901234567890';
    const amount = '1.0';
    const privateKey = '0xprivatekey123456789012345678901234567890123456789012345678901234';

    beforeEach(() => {
      mockCreateWallet.mockReturnValue({
        account: { address: userAddress },
        writeContract: vi.fn().mockResolvedValue('0xtxhash123')
      });

      mockPublicClient.getBalance.mockResolvedValue(parseEther('2.0'));
      mockPublicClient.waitForTransactionReceipt.mockResolvedValue({
        blockNumber: 12345n,
        gasUsed: 21000n
      });
    });

    it('should execute deposit successfully', async () => {
      const result = await deposit(userAddress, amount, privateKey);

      expect(result).toEqual({
        txHash: '0xtxhash123',
        blockNumber: 12345n,
        gasUsed: 21000n,
        amount: '1.0',
        userAddress,
        status: 'confirmed'
      });

      expect(mockCreateWallet).toHaveBeenCalledWith(privateKey);
      expect(mockPublicClient.getBalance).toHaveBeenCalledWith({ address: userAddress });
    });

    it('should throw error for invalid address', async () => {
      mockIsAddress.mockReturnValue(false);

      await expect(deposit('invalid', amount, privateKey))
        .rejects.toThrow('Invalid Ethereum address');
    });

    it('should throw error for invalid private key', async () => {
      await expect(deposit(userAddress, amount, 'invalid'))
        .rejects.toThrow('Invalid private key');
    });

    it('should throw error for invalid amount', async () => {
      await expect(deposit(userAddress, '0', privateKey))
        .rejects.toThrow('Amount must be greater than 0');
    });

    it('should throw error for insufficient balance', async () => {
      mockPublicClient.getBalance.mockResolvedValue(parseEther('0.5'));

      await expect(deposit(userAddress, amount, privateKey))
        .rejects.toThrow('Insufficient ETH balance');
    });

    it('should throw error for mismatched address', async () => {
      mockCreateWallet.mockReturnValue({
        account: { address: '0xdifferentaddress' },
        writeContract: vi.fn()
      });

      await expect(deposit(userAddress, amount, privateKey))
        .rejects.toThrow('Private key does not match user address');
    });
  });

  describe('withdraw', () => {
    const userAddress = '0x1234567890123456789012345678901234567890';
    const shareAmount = '1.0';
    const privateKey = '0xprivatekey123456789012345678901234567890123456789012345678901234';

    beforeEach(() => {
      mockCreateWallet.mockReturnValue({
        account: { address: userAddress },
        writeContract: vi.fn().mockResolvedValue('0xtxhash456')
      });

      mockPublicClient.readContract
        .mockResolvedValueOnce(parseEther('2.0')) // balanceOf (user shares)
        .mockResolvedValueOnce(parseEther('1.05')); // convertToAssets

      mockPublicClient.waitForTransactionReceipt.mockResolvedValue({
        blockNumber: 12346n,
        gasUsed: 35000n
      });
    });

    it('should execute withdraw successfully', async () => {
      const result = await withdraw(userAddress, shareAmount, privateKey);

      expect(result).toEqual({
        txHash: '0xtxhash456',
        blockNumber: 12346n,
        gasUsed: 35000n,
        shareAmount: '1.0',
        ethAmount: '1.05',
        userAddress,
        status: 'confirmed'
      });
    });

    it('should throw error for insufficient shares', async () => {
      mockPublicClient.readContract
        .mockResolvedValueOnce(parseEther('0.5')); // balanceOf (insufficient)

      await expect(withdraw(userAddress, shareAmount, privateKey))
        .rejects.toThrow('Insufficient shares');
    });

    it('should throw error for invalid address', async () => {
      mockIsAddress.mockReturnValue(false);

      await expect(withdraw('invalid', shareAmount, privateKey))
        .rejects.toThrow('Invalid Ethereum address');
    });
  });

  describe('getCurrentBlock', () => {
    it('should return current block number', async () => {
      mockPublicClient.getBlockNumber.mockResolvedValue(12345n);

      const result = await getCurrentBlock();

      expect(result).toBe(12345);
    });

    it('should handle errors', async () => {
      mockPublicClient.getBlockNumber.mockRejectedValue(new Error('RPC error'));

      await expect(getCurrentBlock()).rejects.toThrow('RPC error');
    });
  });
});
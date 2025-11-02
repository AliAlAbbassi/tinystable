import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { deposit, withdraw } from '../transaction';
import * as blockchain from '../../blockchain';
import { parseEther, isAddress } from 'viem';

vi.mock('../../blockchain', () => ({
  publicClient: {
    readContract: vi.fn(),
    getBalance: vi.fn(),
    waitForTransactionReceipt: vi.fn(),
  },
  CONTRACTS: {
    TINY_VAULT: '0x678282d82ccc897b2ae38f328b53c3bf5a594e13',
    WETH: '0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c',
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

describe('Vault Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (isAddress as Mock).mockReturnValue(true);
  });

  describe('deposit', () => {
    const userAddress = '0x1234567890123456789012345678901234567890';
    const amount = '1.0';
    const privateKey = '0xprivatekey123456789012345678901234567890123456789012345678901234';

    beforeEach(() => {
      mockCreateWallet.mockReturnValue({
        account: { address: userAddress },
        writeContract: vi.fn().mockResolvedValue('0xtxhash123'),
        sendTransaction: vi.fn().mockResolvedValue('0xwraptxhash')
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

      mockPublicClient.waitForTransactionReceipt.mockResolvedValue({
        blockNumber: 12346n,
        gasUsed: 35000n
      });
    });

    it('should execute withdraw successfully', async () => {
      mockPublicClient.readContract
        .mockResolvedValueOnce(parseEther('2.0')) // balanceOf (user shares)
        .mockResolvedValueOnce(parseEther('1.05')); // convertToAssets

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
  });
});

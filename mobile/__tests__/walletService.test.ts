import { generateWallet, importWallet, formatAddress, formatPrivateKey } from '../src/services/walletService';

describe('WalletService', () => {
  describe('generateWallet', () => {
    it('should generate a wallet with address and private key', () => {
      const wallet = generateWallet();

      expect(wallet).toHaveProperty('address');
      expect(wallet).toHaveProperty('privateKey');
      expect(typeof wallet.address).toBe('string');
      expect(typeof wallet.privateKey).toBe('string');
    });

    it('should generate valid Ethereum address format', () => {
      const wallet = generateWallet();

      expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should generate valid private key format', () => {
      const wallet = generateWallet();

      expect(wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('should generate unique wallets each time', () => {
      const wallet1 = generateWallet();
      const wallet2 = generateWallet();

      expect(wallet1.address).not.toBe(wallet2.address);
      expect(wallet1.privateKey).not.toBe(wallet2.privateKey);
    });
  });

  describe('importWallet', () => {
    it('should import wallet from valid private key', () => {
      const privateKey = '0x1234567890123456789012345678901234567890123456789012345678901234';
      const wallet = importWallet(privateKey);

      expect(wallet).toHaveProperty('address');
      expect(wallet).toHaveProperty('privateKey');
      expect(typeof wallet.address).toBe('string');
      expect(wallet.privateKey).toBe(privateKey);
      expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should import wallet from private key without 0x prefix', () => {
      const privateKey = '1234567890123456789012345678901234567890123456789012345678901234';
      const wallet = importWallet(privateKey);

      expect(wallet.privateKey).toBe(`0x${privateKey}`);
    });

    it('should throw error for invalid private key format', () => {
      expect(() => importWallet('invalid')).toThrow('Invalid private key');
      expect(() => importWallet('0x123')).toThrow('Invalid private key');
      expect(() => importWallet('')).toThrow('Invalid private key');
    });

    it('should throw error for private key with invalid characters', () => {
      const invalidKey = '0x123456789012345678901234567890123456789012345678901234567890123g';
      expect(() => importWallet(invalidKey)).toThrow('Invalid private key');
    });
  });

  describe('formatAddress', () => {
    it('should format address correctly', () => {
      const address = '0x1234567890123456789012345678901234567890';
      const formatted = formatAddress(address);

      expect(formatted).toBe('0x1234...7890');
    });

    it('should handle short addresses', () => {
      const address = '0x123456';
      const formatted = formatAddress(address);

      expect(formatted).toBe('0x1234...3456');
    });
  });

  describe('formatPrivateKey', () => {
    it('should format private key correctly', () => {
      const privateKey = '0x1234567890123456789012345678901234567890123456789012345678901234';
      const formatted = formatPrivateKey(privateKey);

      expect(formatted).toBe('0x123456...901234');
    });

    it('should handle short private keys', () => {
      const privateKey = '0x12345678';
      const formatted = formatPrivateKey(privateKey);

      expect(formatted).toBe('0x123456...345678');
    });
  });
});
import { WalletService } from '../src/services/walletService';

describe('WalletService', () => {
  describe('generateWallet', () => {
    it('should generate a wallet with address and private key', () => {
      const wallet = WalletService.generateWallet();

      expect(wallet).toHaveProperty('address');
      expect(wallet).toHaveProperty('privateKey');
      expect(typeof wallet.address).toBe('string');
      expect(typeof wallet.privateKey).toBe('string');
    });

    it('should generate valid Ethereum address format', () => {
      const wallet = WalletService.generateWallet();

      expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should generate valid private key format', () => {
      const wallet = WalletService.generateWallet();

      expect(wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('should generate unique wallets each time', () => {
      const wallet1 = WalletService.generateWallet();
      const wallet2 = WalletService.generateWallet();

      expect(wallet1.address).not.toBe(wallet2.address);
      expect(wallet1.privateKey).not.toBe(wallet2.privateKey);
    });
  });

  describe('formatAddress', () => {
    it('should format address correctly', () => {
      const address = '0x1234567890123456789012345678901234567890';
      const formatted = WalletService.formatAddress(address);

      expect(formatted).toBe('0x1234...7890');
    });

    it('should handle short addresses', () => {
      const address = '0x123456';
      const formatted = WalletService.formatAddress(address);

      expect(formatted).toBe('0x1234...3456');
    });
  });

  describe('formatPrivateKey', () => {
    it('should format private key correctly', () => {
      const privateKey = '0x1234567890123456789012345678901234567890123456789012345678901234';
      const formatted = WalletService.formatPrivateKey(privateKey);

      expect(formatted).toBe('0x123456...901234');
    });

    it('should handle short private keys', () => {
      const privateKey = '0x12345678';
      const formatted = WalletService.formatPrivateKey(privateKey);

      expect(formatted).toBe('0x123456...345678');
    });
  });
});
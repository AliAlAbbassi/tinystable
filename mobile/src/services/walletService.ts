import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

export class WalletService {
  // ONLY for local wallet generation - no blockchain calls
  static generateWallet() {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    return {
      address: account.address,
      privateKey: privateKey,
    };
  }

  static formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  static formatPrivateKey(privateKey: string): string {
    return `${privateKey.slice(0, 8)}...${privateKey.slice(-6)}`;
  }
}
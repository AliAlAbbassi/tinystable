const API_URL = 'http://localhost:3001';

export class ApiService {
  // Fetch vault stats (APY, TVL, etc)
  static async getVaultStats() {
    try {
      const response = await fetch(`${API_URL}/vault/stats`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch vault stats:', error);
      throw error;
    }
  }

  // Get user balance from blockchain
  static async getUserBalance(address: string) {
    try {
      const response = await fetch(`${API_URL}/vault/balance/${address}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch user balance:', error);
      throw error;
    }
  }

  // Get current APY from Aave
  static async getCurrentApy() {
    try {
      const response = await fetch(`${API_URL}/aave/apy`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch APY:', error);
      throw error;
    }
  }

  // TODO: Add deposit/withdraw endpoints when backend implements them
  static async deposit(address: string, amount: string, privateKey: string) {
    // Backend will handle the actual transaction
    console.log('Deposit not implemented yet');
  }

  static async withdraw(address: string, amount: string, privateKey: string) {
    // Backend will handle the actual transaction
    console.log('Withdraw not implemented yet');
  }
}
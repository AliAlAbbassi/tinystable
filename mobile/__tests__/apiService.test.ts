import { getVaultStats, getUserBalance, getCurrentApy, deposit, withdraw } from '../src/services/apiService';

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('getVaultStats', () => {
    it('should fetch vault stats successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          apy: '4.2',
          tvl: '$1000.00',
          userCount: '5'
        }
      };

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      } as any);

      const result = await getVaultStats();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/vault/stats');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle fetch errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getVaultStats()).rejects.toThrow('Network error');
    });
  });

  describe('getUserBalance', () => {
    it('should fetch user balance successfully', async () => {
      const address = '0x1234567890123456789012345678901234567890';
      const mockResponse = {
        success: true,
        data: {
          ethBalance: '1.5',
          vaultBalance: '0.8'
        }
      };

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      } as any);

      const result = await getUserBalance(address);

      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3001/vault/balance/${address}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle invalid address format', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Invalid address'));

      await expect(getUserBalance('invalid')).rejects.toThrow('Invalid address');
    });
  });

  describe('getCurrentApy', () => {
    it('should fetch current APY successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          apy: '4.2'
        }
      };

      mockFetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      } as any);

      const result = await getCurrentApy();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/aave/apy');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deposit', () => {
    it('should log that deposit is not implemented', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      deposit('0x123', '1.0', '0xprivatekey');

      expect(consoleSpy).toHaveBeenCalledWith('Deposit not implemented yet');
      consoleSpy.mockRestore();
    });
  });

  describe('withdraw', () => {
    it('should log that withdraw is not implemented', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      withdraw('0x123', '1.0', '0xprivatekey');

      expect(consoleSpy).toHaveBeenCalledWith('Withdraw not implemented yet');
      consoleSpy.mockRestore();
    });
  });
});
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
    it('should call deposit endpoint successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          txHash: '0xabc123',
          amount: '1.0'
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      } as any);

      const result = await deposit('0x123', '1.0', '0xprivatekey');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/vault/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: '0x123',
          amount: '1.0',
          privateKey: '0xprivatekey'
        })
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle deposit errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ error: 'Insufficient balance' }),
      } as any);

      await expect(deposit('0x123', '1.0', '0xprivatekey')).rejects.toThrow('Insufficient balance');
    });
  });

  describe('withdraw', () => {
    it('should call withdraw endpoint successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          txHash: '0xdef456',
          amount: '0.5'
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      } as any);

      const result = await withdraw('0x123', '0.5', '0xprivatekey');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/vault/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: '0x123',
          amount: '0.5',
          privateKey: '0xprivatekey'
        })
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle withdraw errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ error: 'Insufficient vault balance' }),
      } as any);

      await expect(withdraw('0x123', '0.5', '0xprivatekey')).rejects.toThrow('Insufficient vault balance');
    });
  });
});
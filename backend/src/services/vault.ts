import { formatEther } from 'viem';
import { publicClient, CONTRACTS, TINY_VAULT_ABI } from './blockchain';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 30 });

export class VaultService {
  async getVaultStats() {
    const cacheKey = 'vault-stats';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      if (!CONTRACTS.TINY_VAULT) {
        throw new Error('TINY_VAULT_ADDRESS not configured');
      }

      const [totalAssets, totalSupply, apy] = await Promise.all([
        publicClient.readContract({
          address: CONTRACTS.TINY_VAULT,
          abi: TINY_VAULT_ABI,
          functionName: 'totalAssets'
        }),
        publicClient.readContract({
          address: CONTRACTS.TINY_VAULT,
          abi: TINY_VAULT_ABI,
          functionName: 'totalSupply'
        }),
        publicClient.readContract({
          address: CONTRACTS.TINY_VAULT,
          abi: TINY_VAULT_ABI,
          functionName: 'getApy'
        })
      ]);

      const stats = {
        totalAssets: formatEther(totalAssets),
        totalSupply: formatEther(totalSupply),
        apy: Number(apy),
        tvl: formatEther(totalAssets), // TVL = Total Value Locked = totalAssets
        lastUpdated: new Date().toISOString()
      };

      cache.set(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Error fetching vault stats:', error);
      throw error;
    }
  }

  async getUserBalance(userAddress: string) {
    const cacheKey = `user-balance-${userAddress}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      if (!CONTRACTS.TINY_VAULT) {
        throw new Error('TINY_VAULT_ADDRESS not configured');
      }

      const [balance, shares, userYield, deposited] = await Promise.all([
        publicClient.readContract({
          address: CONTRACTS.TINY_VAULT,
          abi: TINY_VAULT_ABI,
          functionName: 'getUserBalance',
          args: [userAddress as `0x${string}`]
        }),
        publicClient.readContract({
          address: CONTRACTS.TINY_VAULT,
          abi: TINY_VAULT_ABI,
          functionName: 'balanceOf',
          args: [userAddress as `0x${string}`]
        }),
        publicClient.readContract({
          address: CONTRACTS.TINY_VAULT,
          abi: TINY_VAULT_ABI,
          functionName: 'getUserYield',
          args: [userAddress as `0x${string}`]
        }),
        publicClient.readContract({
          address: CONTRACTS.TINY_VAULT,
          abi: TINY_VAULT_ABI,
          functionName: 'userDeposits',
          args: [userAddress as `0x${string}`]
        })
      ]);

      const userBalance = {
        address: userAddress,
        balance: formatEther(balance),
        shares: formatEther(shares),
        yield: formatEther(userYield),
        depositedAmount: formatEther(deposited),
        lastUpdated: new Date().toISOString()
      };

      cache.set(cacheKey, userBalance, 10); // Cache user data for 10 seconds
      return userBalance;
    } catch (error) {
      console.error('Error fetching user balance:', error);
      throw error;
    }
  }

  async getCurrentBlock() {
    try {
      const blockNumber = await publicClient.getBlockNumber();
      return Number(blockNumber);
    } catch (error) {
      console.error('Error fetching block number:', error);
      throw error;
    }
  }
}
import { formatEther, Address, isAddress } from 'viem';
import { publicClient, CONTRACTS, TINY_VAULT_ABI } from '../blockchain';
import { cache } from '../cache';
import { UserBalance } from './types';

export const getUserBalance = async (userAddress: string): Promise<UserBalance> => {
  if (!isAddress(userAddress)) {
    throw new Error('Invalid Ethereum address');
  }

  const cacheKey = `user-balance-${userAddress}`;
  const cached = cache.get<UserBalance>(cacheKey);
  if (cached) return cached;

  try {
    if (!CONTRACTS.TINY_VAULT) {
      throw new Error('TINY_VAULT_ADDRESS not configured');
    }

    const results = await publicClient.multicall({
      contracts: [
        {
          address: CONTRACTS.TINY_VAULT,
          abi: TINY_VAULT_ABI,
          functionName: 'getUserBalance',
          args: [userAddress as Address]
        },
        {
          address: CONTRACTS.TINY_VAULT,
          abi: TINY_VAULT_ABI,
          functionName: 'balanceOf',
          args: [userAddress as Address]
        },
        {
          address: CONTRACTS.TINY_VAULT,
          abi: TINY_VAULT_ABI,
          functionName: 'getUserYield',
          args: [userAddress as Address]
        },
        {
          address: CONTRACTS.TINY_VAULT,
          abi: TINY_VAULT_ABI,
          functionName: 'userDeposits',
          args: [userAddress as Address]
        }
      ]
    });

    const [balance, shares, userYield, deposited] = results.map(r => r.result);

    const userBalance: UserBalance = {
      address: userAddress,
      balance: formatEther(balance as bigint),
      shares: formatEther(shares as bigint),
      yield: formatEther(userYield as bigint),
      depositedAmount: formatEther(deposited as bigint),
      lastUpdated: new Date().toISOString()
    };

    cache.set(cacheKey, userBalance, 10);
    return userBalance;
  } catch (error) {
    console.error('Error fetching user balance:', error);
    throw error;
  }
};

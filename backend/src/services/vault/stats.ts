import { formatEther } from 'viem';
import { publicClient, CONTRACTS, TINY_VAULT_ABI } from '../blockchain';
import { cache } from '../cache';
import { VaultStats } from './types';
import { getEthPrice } from '../external/coingecko';
import { getAaveTvl } from '../external/defillama';

export const getVaultStats = async (): Promise<VaultStats> => {
  const cacheKey = 'vault-stats';
  const cached = cache.get<VaultStats>(cacheKey);
  if (cached) return cached;

  try {
    if (!CONTRACTS.TINY_VAULT) {
      const mockStats: VaultStats = {
        totalAssets: '0.0',
        totalSupply: '0.0',
        apy: 4.2,
        tvl: '$0.00',
        userCount: '0',
        lastUpdated: new Date().toISOString()
      };
      cache.set(cacheKey, mockStats);
      return mockStats;
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

    const [ethPriceUSD, aaveEthTvl] = await Promise.all([
        getEthPrice(),
        getAaveTvl()
    ]);

    const totalAssetsEth = parseFloat(formatEther(totalAssets));
    const tvlUSD = ethPriceUSD > 0 ? totalAssetsEth * ethPriceUSD : 0;

    const aaveFormattedTvl = aaveEthTvl > 0 ? `$${(aaveEthTvl / 1e9).toFixed(1)}B` : 'N/A';

    const stats: VaultStats = {
      totalAssets: totalAssetsEth.toFixed(6),
      totalSupply: parseFloat(formatEther(totalSupply)).toFixed(6),
      apy: Number(apy),
      tvl: `$${tvlUSD.toFixed(2)}`,
      userCount: aaveFormattedTvl, // Show Aave's total TVL instead of fake user count
      lastUpdated: new Date().toISOString()
    };

    cache.set(cacheKey, stats);
    return stats;
  } catch (error) {
    console.error('Error fetching vault stats:', error);
    throw error;
  }
};

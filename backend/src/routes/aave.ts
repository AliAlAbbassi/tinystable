import { Router } from 'express';
import { publicClient, CONTRACTS, TINY_VAULT_ABI } from '../services/blockchain';

export const aaveRoutes: Router = Router();

// GET /aave/apy - Get current APY 
aaveRoutes.get('/apy', async (req, res) => {
  try {
    const apy = await publicClient.readContract({
      address: CONTRACTS.TINY_VAULT,
      abi: TINY_VAULT_ABI,
      functionName: 'getApy'
    });

    const apyString = (Number(apy.toString()) / 100).toFixed(2);

    res.json({
      success: true,
      data: {
        apy: apyString,
        formatted: `${apyString}%`,
        lastUpdated: new Date().toISOString(),
        source: 'TinyVault Contract'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch APY',
      timestamp: new Date().toISOString()
    });
  }
});

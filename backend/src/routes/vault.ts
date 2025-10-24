import { Router } from 'express';
import { VaultService } from '../services/vault';

export const vaultRoutes: Router = Router();
const vaultService = new VaultService();

// GET /vault/stats - Get vault statistics
vaultRoutes.get('/stats', async (req, res) => {
  try {
    const stats = await vaultService.getVaultStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch vault stats',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /vault/balance/:address - Get user balance and position
vaultRoutes.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;

    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address',
        timestamp: new Date().toISOString()
      });
    }

    const balance = await vaultService.getUserBalance(address);
    res.json({
      success: true,
      data: balance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user balance',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /vault/apy - Get current APY
vaultRoutes.get('/apy', async (req, res) => {
  try {
    const stats = await vaultService.getVaultStats();
    res.json({
      success: true,
      data: {
        apy: (stats as any).apy,
        formatted: `${(stats as any).apy}%`,
        lastUpdated: (stats as any).lastUpdated
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
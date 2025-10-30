import { Router } from 'express';
import { getCurrentBlock } from '../services/vault';

export const healthRoutes: Router = Router();

healthRoutes.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TinyStable Backend API',
    version: '1.0.0'
  });
});

healthRoutes.get('/network', async (req, res) => {
  try {
    const blockNumber = await getCurrentBlock();
    res.json({
      network: 'sepolia',
      connected: true,
      blockNumber,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      network: 'sepolia',
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});
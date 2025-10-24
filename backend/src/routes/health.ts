import { Router } from 'express';

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
    // TODO: Add actual network connectivity check
    res.json({
      network: 'sepolia',
      connected: true,
      blockNumber: null // Will implement once we have RPC connection
    });
  } catch (error) {
    res.status(500).json({
      network: 'sepolia',
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
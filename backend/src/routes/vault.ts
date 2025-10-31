import { Router } from 'express';
import { getVaultStats, getUserBalance, deposit, withdraw } from '../services/vault';
import { publicClient } from '../services/blockchain';
import { formatEther, Address } from 'viem';

export const vaultRoutes: Router = Router();

// GET /vault/stats - Get vault statistics
vaultRoutes.get('/stats', async (req, res) => {
  try {
    const stats = await getVaultStats();
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

    const balance = await getUserBalance(address);
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

// GET /vault/eth-balance/:address - Get ETH balance
vaultRoutes.get('/eth-balance/:address', async (req, res) => {
  try {
    const { address } = req.params;

    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address',
        timestamp: new Date().toISOString()
      });
    }

    const balanceWei = await publicClient.getBalance({
      address: address as Address
    });

    const balanceEth = formatEther(balanceWei);

    res.json({
      success: true,
      data: {
        address,
        balance: balanceEth,
        balanceWei: balanceWei.toString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch ETH balance',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /vault/apy - Get current APY
vaultRoutes.get('/apy', async (req, res) => {
  try {
    const stats = await getVaultStats();
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

// POST /vault/deposit - Execute deposit transaction
vaultRoutes.post('/deposit', async (req, res) => {
  try {
    const { address, amount, privateKey } = req.body;

    if (!address || !amount || !privateKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: address, amount, privateKey',
        timestamp: new Date().toISOString()
      });
    }

    if (!address.startsWith('0x') || address.length !== 42) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address format',
        timestamp: new Date().toISOString()
      });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive number',
        timestamp: new Date().toISOString()
      });
    }

    console.log(`Processing deposit: ${amount} ETH for ${address}`);

    const result = await deposit(address, amount, privateKey);

    res.json({
      success: true,
      data: {
        ...result,
        blockNumber: result.blockNumber.toString(),
        gasUsed: result.gasUsed.toString()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Deposit endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process deposit',
      timestamp: new Date().toISOString()
    });
  }
});

// POST /vault/withdraw - Execute withdrawal transaction
vaultRoutes.post('/withdraw', async (req, res) => {
  try {
    const { address, amount, privateKey } = req.body;

    if (!address || !amount || !privateKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: address, amount, privateKey',
        timestamp: new Date().toISOString()
      });
    }

    if (!address.startsWith('0x') || address.length !== 42) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address format',
        timestamp: new Date().toISOString()
      });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive number',
        timestamp: new Date().toISOString()
      });
    }

    console.log(`Processing withdrawal: ${amount} shares for ${address}`);

    const result = await withdraw(address, amount, privateKey);

    res.json({
      success: true,
      data: {
        ...result,
        blockNumber: result.blockNumber.toString(),
        gasUsed: result.gasUsed.toString()
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Withdraw endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process withdrawal',
      timestamp: new Date().toISOString()
    });
  }
});
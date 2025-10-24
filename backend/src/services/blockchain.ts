import { createPublicClient, http, Address } from 'viem';
import { sepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org')
});

export const CONTRACTS = {
  TINY_VAULT: process.env.TINY_VAULT_ADDRESS as Address,
  WETH: '0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c' as Address,
  AAVE_POOL: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951' as Address
};

export const TINY_VAULT_ABI = [
  {
    name: 'totalAssets',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'getApy',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'getUserBalance',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'getUserYield',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'userDeposits',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'address' }],
    outputs: [{ type: 'uint256' }]
  }
] as const;
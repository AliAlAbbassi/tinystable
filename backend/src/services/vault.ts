import { formatEther, parseEther, Address, isAddress } from 'viem';
import { publicClient, CONTRACTS, TINY_VAULT_ABI, createWalletFromPrivateKey } from './blockchain';
import NodeCache from 'node-cache';

const COINGECKO_ETH_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
const DEFILLAMA_AAVE_URL = 'https://api.llama.fi/protocol/aave';

const cache = new NodeCache({ stdTTL: 30 });

type VaultStats = {
  totalAssets: string;
  totalSupply: string;
  apy: number;
  tvl: string;
  userCount?: string;
  lastUpdated: string;
};

type UserBalance = {
  address: string;
  balance: string;
  shares: string;
  yield: string;
  depositedAmount: string;
  lastUpdated: string;
};

type TransactionResult = {
  txHash: string;
  blockNumber: bigint;
  gasUsed: bigint;
  userAddress: string;
  status: 'confirmed';
  amount?: string;
  shareAmount?: string;
  ethAmount?: string;
};

type CoinGeckoPriceResponse = {
  ethereum: {
    usd: number;
  };
};

type DefiLlamaProtocolResponse = {
  currentChainTvls: {
    Ethereum: number;
  };
};

const validatePrivateKey = (privateKey: string): void => {
  if (!privateKey?.startsWith('0x')) {
    throw new Error('Invalid private key');
  }
};

const validateAmount = (amount: string): bigint => {
  const amountWei = parseEther(amount);
  if (amountWei <= 0n) {
    throw new Error('Amount must be greater than 0');
  }
  return amountWei;
};

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

    // Get real data from APIs
    const [ethPriceResponse, aaveDataResponse] = await Promise.all([
      fetch(COINGECKO_ETH_PRICE_URL),
      fetch(DEFILLAMA_AAVE_URL)
    ]);

    const ethPriceData: CoinGeckoPriceResponse | null = ethPriceResponse.ok ? await ethPriceResponse.json() as CoinGeckoPriceResponse : null;
    const aaveData: DefiLlamaProtocolResponse | null = aaveDataResponse.ok ? await aaveDataResponse.json() as DefiLlamaProtocolResponse : null;

    const ethPriceUSD = ethPriceData?.ethereum?.usd || 0;
    const totalAssetsEth = parseFloat(formatEther(totalAssets));
    const tvlUSD = ethPriceUSD > 0 ? totalAssetsEth * ethPriceUSD : 0;

    // Get real Aave protocol stats for context
    const aaveEthTvl = aaveData?.currentChainTvls?.Ethereum || 0;
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

export const deposit = async (
  userAddress: string,
  amount: string,
  privateKey: string
): Promise<TransactionResult> => {
  if (!CONTRACTS.TINY_VAULT) {
    throw new Error('TINY_VAULT_ADDRESS not configured');
  }

  if (!isAddress(userAddress)) {
    throw new Error('Invalid Ethereum address');
  }
  validatePrivateKey(privateKey);
  const amountWei = validateAmount(amount);

  const walletClient = createWalletFromPrivateKey(privateKey);

  if (walletClient.account.address.toLowerCase() !== userAddress.toLowerCase()) {
    throw new Error('Private key does not match user address');
  }

  const ethBalance = await publicClient.getBalance({
    address: userAddress as Address
  });

  if (ethBalance < amountWei) {
    throw new Error(`Insufficient ETH balance. Has ${formatEther(ethBalance)} ETH, needs ${amount} ETH`);
  }

  console.log(`Depositing ${amount} ETH for user ${userAddress}`);

  console.log('Wrapping ETH to WETH...');
  const wrapTxHash = await walletClient.sendTransaction({
    to: CONTRACTS.WETH,
    value: amountWei,
    data: '0xd0e30db0' // deposit() function selector for WETH
  });

  await publicClient.waitForTransactionReceipt({
    hash: wrapTxHash,
    timeout: 60000
  });
  console.log(`ETH wrapped to WETH: ${wrapTxHash}`);

  console.log('Approving vault to spend WETH...');
  const approveTxHash = await walletClient.writeContract({
    address: CONTRACTS.WETH,
    abi: [
      {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ type: 'bool' }]
      }
    ],
    functionName: 'approve',
    args: [CONTRACTS.TINY_VAULT, amountWei]
  });

  await publicClient.waitForTransactionReceipt({
    hash: approveTxHash,
    timeout: 60000
  });
  console.log(`WETH approval confirmed: ${approveTxHash}`);

  console.log('Depositing WETH to vault...');
  const txHash = await walletClient.writeContract({
    address: CONTRACTS.TINY_VAULT,
    abi: TINY_VAULT_ABI,
    functionName: 'deposit',
    args: [amountWei]
    // Note: No 'value' field since we're sending WETH tokens, not ETH
  } as any);

  console.log(`Deposit transaction submitted: ${txHash}`);

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
    timeout: 60000
  });

  console.log(`Deposit confirmed in block ${receipt.blockNumber}`);

  cache.del(`user-balance-${userAddress}`);
  cache.del('vault-stats');

  return {
    txHash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed,
    amount,
    userAddress,
    status: 'confirmed'
  };
};

export const withdraw = async (
  userAddress: string,
  shareAmount: string,
  privateKey: string
): Promise<TransactionResult> => {
  if (!CONTRACTS.TINY_VAULT) {
    throw new Error('TINY_VAULT_ADDRESS not configured');
  }

  if (!isAddress(userAddress)) {
    throw new Error('Invalid Ethereum address');
  }
  validatePrivateKey(privateKey);
  const sharesWei = validateAmount(shareAmount);

  const walletClient = createWalletFromPrivateKey(privateKey);

  if (walletClient.account.address.toLowerCase() !== userAddress.toLowerCase()) {
    throw new Error('Private key does not match user address');
  }

  const userShares = await publicClient.readContract({
    address: CONTRACTS.TINY_VAULT,
    abi: TINY_VAULT_ABI,
    functionName: 'balanceOf',
    args: [userAddress as Address]
  });

  if (userShares < sharesWei) {
    throw new Error(`Insufficient shares. Has ${formatEther(userShares)} shares, trying to withdraw ${shareAmount} shares`);
  }

  const ethAmount = await publicClient.readContract({
    address: CONTRACTS.TINY_VAULT,
    abi: TINY_VAULT_ABI,
    functionName: 'convertToAssets',
    args: [sharesWei]
  });

  console.log(`Withdrawing ${shareAmount} shares (≈${formatEther(ethAmount)} ETH) for user ${userAddress}`);

  const txHash = await walletClient.writeContract({
    address: CONTRACTS.TINY_VAULT,
    abi: TINY_VAULT_ABI,
    functionName: 'withdraw',
    args: [sharesWei]
  });

  console.log(`Withdraw transaction submitted: ${txHash}`);

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
    timeout: 60000
  });

  console.log(`Withdraw confirmed in block ${receipt.blockNumber}`);

  cache.del(`user-balance-${userAddress}`);
  cache.del('vault-stats');

  return {
    txHash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed,
    shareAmount,
    ethAmount: formatEther(ethAmount),
    userAddress,
    status: 'confirmed'
  };
};

export const getCurrentBlock = async (): Promise<number> => {
  const blockNumber = await publicClient.getBlockNumber();
  return Number(blockNumber);
};


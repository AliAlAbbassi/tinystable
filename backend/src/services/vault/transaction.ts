import { formatEther, Address, isAddress } from 'viem';
import { publicClient, CONTRACTS, TINY_VAULT_ABI, createWalletFromPrivateKey } from '../blockchain';
import { cache } from '../cache';
import { TransactionResult } from './types';
import { validatePrivateKey, validateAmount } from '../validation';

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

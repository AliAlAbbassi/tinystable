import { parseEther } from 'viem';

export const validatePrivateKey = (privateKey: string): void => {
  if (!privateKey?.startsWith('0x')) {
    throw new Error('Invalid private key');
  }
};

export const validateAmount = (amount: string): bigint => {
  const amountWei = parseEther(amount);
  if (amountWei <= 0n) {
    throw new Error('Amount must be greater than 0');
  }
  return amountWei;
};

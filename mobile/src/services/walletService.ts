import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

export const generateWallet = () => {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  return {
    address: account.address,
    privateKey: privateKey,
  };
};

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatPrivateKey = (privateKey: string): string => {
  return `${privateKey.slice(0, 8)}...${privateKey.slice(-6)}`;
};
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

export const generateWallet = () => {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  return {
    address: account.address,
    privateKey: privateKey,
  };
};

export const importWallet = (privateKey: string) => {
  try {
    // Remove 0x prefix if present and validate hex
    const cleanKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;

    // Validate private key format
    if (!/^0x[a-fA-F0-9]{64}$/.test(cleanKey)) {
      throw new Error('Invalid private key format');
    }

    const account = privateKeyToAccount(cleanKey as `0x${string}`);

    return {
      address: account.address,
      privateKey: cleanKey,
    };
  } catch (error) {
    throw new Error('Invalid private key');
  }
};

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatPrivateKey = (privateKey: string): string => {
  return `${privateKey.slice(0, 8)}...${privateKey.slice(-6)}`;
};
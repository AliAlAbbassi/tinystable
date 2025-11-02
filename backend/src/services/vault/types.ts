export type VaultStats = {
  totalAssets: string;
  totalSupply: string;
  apy: number;
  tvl: string;
  userCount?: string;
  lastUpdated: string;
};

export type UserBalance = {
  address: string;
  balance: string;
  shares: string;
  yield: string;
  depositedAmount: string;
  lastUpdated: string;
};

export type TransactionResult = {
  txHash: string;
  blockNumber: bigint;
  gasUsed: bigint;
  userAddress: string;
  status: 'confirmed';
  amount?: string;
  shareAmount?: string;
  ethAmount?: string;
};

export type CoinGeckoPriceResponse = {
  ethereum: {
    usd: number;
  };
};

export type DefiLlamaProtocolResponse = {
  currentChainTvls: {
    Ethereum: number;
  };
};

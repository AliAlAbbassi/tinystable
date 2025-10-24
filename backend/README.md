# TinyStable Backend API

Backend API for the TinyStable ETH vault, providing real-time data from the smart contract and Aave protocol.

## Features

- ✅ **Vault Statistics** - TVL, APY, total assets
- ✅ **User Balances** - Individual user positions and yield
- ✅ **Aave Integration** - Real-time DeFi protocol data
- ✅ **Caching** - 30-second cache to reduce RPC calls
- ✅ **Error Handling** - Comprehensive error responses

## API Endpoints

### Health Check
```
GET /health
GET /health/network
```

### Vault Data
```
GET /vault/stats          # Vault statistics (TVL, APY, etc.)
GET /vault/apy            # Current APY
GET /vault/balance/:address   # User balance and position
```

### Aave Data
```
GET /aave/rates           # Current Aave rates for WETH
GET /aave/pool-data       # Aave pool information
```

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Add your TINY_VAULT_ADDRESS after deploying the contract
   ```

3. **Run development server:**
   ```bash
   pnpm dev
   ```

4. **Build for production:**
   ```bash
   pnpm build
   pnpm start
   ```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `SEPOLIA_RPC_URL` - Ethereum Sepolia RPC endpoint
- `TINY_VAULT_ADDRESS` - Deployed TinyVault contract address

## Example Responses

### Vault Stats
```json
{
  "success": true,
  "data": {
    "totalAssets": "12.5",
    "totalSupply": "12.3",
    "apy": 3,
    "tvl": "12.5",
    "lastUpdated": "2025-10-24T15:37:21.260Z"
  },
  "timestamp": "2025-10-24T15:37:21.260Z"
}
```

### User Balance
```json
{
  "success": true,
  "data": {
    "address": "0x...",
    "balance": "1.05",
    "shares": "1.0",
    "yield": "0.05",
    "depositedAmount": "1.0",
    "lastUpdated": "2025-10-24T15:37:21.260Z"
  },
  "timestamp": "2025-10-24T15:37:21.260Z"
}
```

## Integration

Once you deploy the TinyVault contract, add the address to `.env`:
```
TINY_VAULT_ADDRESS=0x1234567890abcdef...
```

The API will automatically start reading real data from your deployed contract on Sepolia testnet.
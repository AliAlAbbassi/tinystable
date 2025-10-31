# tinystable

A minimal implementation of stablecoin savings with DeFi yields.

[Demo Video] 
https://www.loom.com/share/5377858cc4ae456db1060d2fe6395169

[Live Testnet App]

## What It Does
Users deposit ETH (GETS converted to wrapped eth WETH) → automatically earns Aave yields → withdraw anytime.
Everything is self-custody. Only the user controls their keys.


# run it with pnpm (it's a monorepo) 
- Run pnpm contracts:compile to compile contracts
- Run pnpm backend:dev to start the backend
- Run pnpm mobile:start to launch Expo
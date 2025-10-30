import { ethers } from 'hardhat';

async function main() {
  const aavePoolAddress = '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951'; // Aave V3 Sepolia Pool
  const wethAddress = '0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c'; // Sepolia WETH

  const pool = await ethers.getContractAt('contracts/interfaces/IPool.sol:IPool', aavePoolAddress);

  const reserveData = await pool.getReserveData(wethAddress);

  console.log('Aave V3 Sepolia WETH Reserve Data:');
  console.log(`  currentLiquidityRate: ${reserveData.currentLiquidityRate.toString()}`);

  const apy = reserveData.currentLiquidityRate.div(1e25);
  console.log(`  APY (calculated): ${apy.toString()}%`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

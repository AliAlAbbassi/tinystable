import { ethers } from 'hardhat';

async function main() {
  const contractAddress = process.env.TINY_VAULT_ADDRESS;
  const userAddress = process.env.USER_BALANCE;

  if (!contractAddress || !userAddress) {
    throw new Error('Please provide a contract address and a user address');
  }

  console.log(`Checking balance for user: ${userAddress}`);
  console.log(`Contract address: ${contractAddress}`);

  const tinyVault = await ethers.getContractAt('TinyVault', contractAddress);

  const shares = await tinyVault.balanceOf(userAddress);
  const balance = await tinyVault.getUserBalance(userAddress);

  console.log(`  Shares (tvETH): ${ethers.formatEther(shares)}`);
  console.log(`  Balance (ETH): ${ethers.formatEther(balance)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

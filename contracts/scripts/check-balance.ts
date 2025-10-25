import { viem } from "hardhat";

async function main() {
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  console.log("Deployer address:", deployer.account.address);

  const balance = await publicClient.getBalance({
    address: deployer.account.address
  });

  console.log("Balance (wei):", balance.toString());
  console.log("Balance (ETH):", (Number(balance) / 1e18).toFixed(6));
}

main().catch(console.error);
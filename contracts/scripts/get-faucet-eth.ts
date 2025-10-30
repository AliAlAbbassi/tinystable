import { viem } from "hardhat";
import { formatEther } from "viem";

async function main() {
  try {
    const [deployer] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    console.log("🚰 Sepolia ETH Faucet Helper");
    console.log("============================");
    console.log("Deployer address:", deployer.account.address);

    // Check current balance
    let balance;
    try {
      balance = await publicClient.getBalance({
        address: deployer.account.address
      });
      console.log("Current balance:", formatEther(balance), "ETH");
    } catch (error) {
      console.error("❌ Error checking balance:", error instanceof Error ? error.message : String(error));
      process.exit(1);
    }

    // Check if we already have enough ETH for deployment (need ~0.05 ETH minimum)
    const minRequired = BigInt("50000000000000000"); // 0.05 ETH in wei
    if (balance >= minRequired) {
      console.log("✅ Sufficient balance for deployment!");
      console.log("💡 You can proceed with deployment using: npm run deploy");
      return;
    }

    console.log("⚠️  Insufficient balance for deployment");
    console.log("💰 Minimum required: 0.05 ETH");
    console.log("🔗 Get Sepolia ETH from these faucets:");
    console.log("");
    console.log("1. Alchemy Sepolia Faucet:");
    console.log("   https://www.alchemy.com/faucets/ethereum-sepolia");
    console.log("");
    console.log("2. Sepolia Faucet (sepoliafaucet.com):");
    console.log("   https://sepoliafaucet.com/");
    console.log("");
    console.log("3. Google Cloud Web3 Faucet:");
    console.log("   https://cloud.google.com/application/web3/faucet/ethereum/sepolia");
    console.log("");
    console.log("4. Chainlink Faucet:");
    console.log("   https://faucets.chain.link/sepolia");
    console.log("");
    console.log("📋 Copy this address to the faucet:");
    console.log("   ", deployer.account.address);
    console.log("");
    console.log("⏳ After getting faucet ETH, run this script again to verify:");
    console.log("   npx hardhat run scripts/get-faucet-eth.ts --network sepolia");

  } catch (error) {
    console.error("❌ Script failed:");
    if (error instanceof Error) {
      console.error("   Error:", error.message);
      if (error.stack) {
        console.error("   Stack:", error.stack);
      }
    } else {
      console.error("   Unknown error:", String(error));
    }
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

main().catch((error) => {
  console.error("❌ Main function failed:", error);
  process.exit(1);
});
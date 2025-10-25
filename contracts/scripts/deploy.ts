import { viem } from "hardhat";

async function main() {
  const [deployer] = await viem.getWalletClients();

  console.log("Deploying contracts with the account:", deployer.account.address);

  // Sepolia testnet addresses for Aave V3
  const SEPOLIA_WETH = "0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c"; // WETH on Sepolia
  const SEPOLIA_AWETH = "0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830"; // aWETH on Sepolia
  const SEPOLIA_POOL = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"; // Aave V3 Pool on Sepolia

  console.log("WETH Address:", SEPOLIA_WETH);
  console.log("aWETH Address:", SEPOLIA_AWETH);
  console.log("Pool Address:", SEPOLIA_POOL);

  // Deploy TinyVault with explicit gas settings
  const tinyVault = await viem.deployContract("TinyVault", [
    SEPOLIA_WETH,
    SEPOLIA_AWETH,
    SEPOLIA_POOL,
  ], {
    gas: 2000000n,
    gasPrice: 20000000000n, // 20 gwei
  });

  console.log("TinyVault deployed to:", tinyVault.address);

  // Wait for deployment to be mined
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log("\n=== Deployment Summary ===");
  console.log("TinyVault:", tinyVault.address);
  console.log("Network: Sepolia");
  console.log("Deployer:", deployer.account.address);

  // Verify the contract exists
  try {
    const publicClient = await viem.getPublicClient();
    const code = await publicClient.getBytecode({ address: tinyVault.address });
    console.log("Contract bytecode length:", code?.length || 0);
  } catch (error) {
    console.error("Error getting bytecode:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
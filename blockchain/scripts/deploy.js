const hre = require("hardhat");

async function main() {
  console.log("Deploying Bank contract...");

  const Bank = await hre.ethers.getContractFactory("Bank");
  const bank = await Bank.deploy();

  await bank.waitForDeployment();

  const address = await bank.getAddress();
  console.log("Bank contract deployed to:", address);
  console.log("\nAdd this to your .env file:");
  console.log(`BANK_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }
);


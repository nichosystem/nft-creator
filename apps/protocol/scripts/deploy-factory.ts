import { ethers } from "hardhat";

async function main() {
  // Get signer
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log(
    "Deploying with account",
    deployer.address,
    "on network",
    network.chainId
  );

  // Deploy
  const NFTFactory_factory = await ethers.getContractFactory("NFTFactory");
  const deployedContract = await NFTFactory_factory.deploy();
  console.log("NFTFactory deployed to:", deployedContract.address);

  // Initialize contract starting params
  const price = 0;
  const royalty = 0;
  const signer = await deployer.getAddress();
  const nftFactory = NFTFactory_factory.attach(deployedContract.address);
  try {
    const tx = await nftFactory.updateFactory(price, royalty, signer);
    await tx.wait();
    console.log(
      `Updated NFTFactory with ${price} price, ${royalty} royalter, ${signer} signer`
    );
  } catch (e) {
    console.log("Failed to update NFTFactory");
    console.log(e);
  }

  // Deploy a collection
  try {
    const tx = await nftFactory.ownerDeploy("MetaMask", "MM", signer, 200, 20);
    await tx.wait();
    console.log(`Deployed new NFT collection`);
  } catch (e) {
    console.log("Failed to deploy a collection");
    console.log(e);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

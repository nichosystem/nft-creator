import { ethers, hardhatArguments } from "hardhat";

async function main() {
  if (!hardhatArguments.network) throw new Error("Please pass --network");
  const network = hardhatArguments.network;

  // Get signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account", deployer.address, "on ", network);

  try {
    // Deploy
    const NFTFactory_factory = await ethers.getContractFactory("NFTFactory");
    const deployedContract = await NFTFactory_factory.deploy();
    console.log("NFTFactory deployed to:", deployedContract.address);

    // Initialize contract starting params
    // const price = 0;
    // const royalty = 0;
    // const signer = await deployer.getAddress();
    // const nftFactory = NFTFactory_factory.attach(deployedContract.address);
    // const updateTx = await nftFactory.updateFactory(price, royalty, signer);
    // await updateTx.wait();
    // console.log(
    //   `Updated NFTFactory with ${price} price, ${royalty} royalter, ${signer} signer`
    // );

    // Deploy a collection
    // const tx = await nftFactory.ownerDeploy("MetaMask", "MM", signer, 200, 20);
    // await tx.wait();
    // console.log(`Deployed new NFT collection`);
  } catch (e) {
    console.log(e);
    return;
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

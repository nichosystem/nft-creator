import { ethers, Signer } from "ethers";
import { CONTRACTS } from "./contracts";

export const deploy = async (
  signer: Signer,
  name: string,
  symbol: string,
  maxSupply: number,
  txLimit: number
) => {
  const factory = await CONTRACTS.nftFactory.connect(signer);
  if (!factory) return;
  try {
    const tx = await factory.deploy(
      await signer.getAddress(),
      name,
      symbol,
      maxSupply,
      txLimit
    );
    return await tx.wait();
  } catch (e) {
    console.log("Factory deploy failed");
    console.error(e);
  }
};

export const getOwnedCollections = async (
  signerOrProvider: Signer | ethers.providers.Provider,
  address: string
) => {
  const factory = await CONTRACTS.nftFactory.connect(signerOrProvider);
  if (!factory) return;
  return await factory.getOwnedCollections(address);
};

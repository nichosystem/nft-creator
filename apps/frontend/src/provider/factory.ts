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
    return await factory.deploy(
      await signer.getAddress(),
      name,
      symbol,
      maxSupply,
      txLimit
    );
  } catch (e) {
    console.log("ERROR: Factory deploy failed");
    console.log(e);
  }
};

export const getOwnedCollections = async (
  signerOrProvider: Signer | ethers.providers.Provider,
  address: string
) => {
  try {
    const factory = await CONTRACTS.nftFactory.connect(signerOrProvider);
    if (!factory) return;
    return await factory.getOwnedCollections(address);
  } catch (e) {
    console.log("ERROR: getOwnedCollections");
    console.log(e);
  }
};

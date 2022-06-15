import { BigNumber, ethers } from "ethers";
import { NFTCollection__factory } from "../types/contracts";

export type CollectionDetails = {
  maxSupply: number;
  txLimit: number;
  baseURI: string;
  batchSupply: number;
  giftedAmount: number;
  price: BigNumber;
  protectedSaleLive: boolean;
  saleLive: boolean;
  totalSupply: number;
};

export const getCollectionDetails = async (
  provider: ethers.providers.BaseProvider,
  address: string
): Promise<CollectionDetails | undefined> => {
  const collection = NFTCollection__factory.connect(address, provider);
  try {
    const [
      maxSupply,
      txLimit,
      baseURI,
      batchSupply,
      giftedAmount,
      price,
      protectedSaleLive,
      saleLive,
      totalSupply,
    ] = await Promise.all([
      collection.MAX_SUPPLY(),
      collection.TX_LIMIT(),
      collection.baseURI(),
      collection.batchSupply(),
      collection.giftedAmount(),
      collection.price(),
      collection.protectedSaleLive(),
      collection.saleLive(),
      collection.totalSupply(),
    ]);
    return {
      maxSupply: maxSupply.toNumber(),
      txLimit: txLimit.toNumber(),
      baseURI,
      batchSupply: batchSupply.toNumber(),
      giftedAmount: giftedAmount.toNumber(),
      price,
      protectedSaleLive,
      saleLive,
      totalSupply: totalSupply.toNumber(),
    };
  } catch (e) {
    console.log("ERROR: getCollectionDetails");
    console.log(e);
  }
};

import { BigNumber, ethers } from "ethers";
import { NFTCollection__factory } from "../types/contracts";

export type CollectionDetails = {
  maxSupply: number;
  txLimit: number;
  baseURI: string;
  batchSupply: number;
  giftedAmount: number;
  name: string;
  price: BigNumber;
  protectedSaleLive: boolean;
  saleLive: boolean;
  symbol: string;
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
      name,
      price,
      protectedSaleLive,
      saleLive,
      symbol,
      totalSupply,
    ] = await Promise.all([
      collection.MAX_SUPPLY(),
      collection.TX_LIMIT(),
      collection.baseURI(),
      collection.batchSupply(),
      collection.giftedAmount(),
      collection.name(),
      collection.price(),
      collection.protectedSaleLive(),
      collection.saleLive(),
      collection.symbol(),
      collection.totalSupply(),
    ]);
    return {
      maxSupply: maxSupply.toNumber(),
      txLimit: txLimit.toNumber(),
      baseURI,
      batchSupply: batchSupply.toNumber(),
      giftedAmount: giftedAmount.toNumber(),
      name,
      price,
      protectedSaleLive,
      saleLive,
      symbol,
      totalSupply: totalSupply.toNumber(),
    };
  } catch (e) {
    console.log("ERROR: getCollectionDetails");
    console.log(e);
  }
};

export const gift = () => {
  console.log("gift");
};

export const renounceOwner = () => {
  console.log("renounce");
};

export const setBaseURI = () => {
  console.log("setBaseURI");
};

export const setBatchSupply = () => {
  console.log("setBatchSupply");
};

export const setPrice = () => {
  console.log("setPrice");
};

export const toggleSale = () => {
  console.log("toggleSale");
};

export const transferOwner = () => {
  console.log("transferOwner");
};

export const withdraw = () => {
  console.log("withdraw");
};

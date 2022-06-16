import { BigNumber, ethers } from "ethers";
import { NFTCollection } from "../types/contracts";

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
  collection: NFTCollection
): Promise<CollectionDetails | undefined> => {
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

export const gift = async (collection: NFTCollection, gifts: string) => {
  return await collection.gift(gifts.split(","));
};

export const renounceOwner = async (collection: NFTCollection) => {
  return await collection.renounceOwnership();
};

export const setBaseURI = async (
  collection: NFTCollection,
  baseURI: string
) => {
  return await collection.setBaseURI(baseURI);
};

export const setBatchSupply = async (
  collection: NFTCollection,
  batchSupply: string
) => {
  return await collection.setPrice(ethers.utils.parseEther(batchSupply));
};

export const setPrice = async (collection: NFTCollection, price: string) => {
  return await collection.setPrice(ethers.utils.parseEther(price));
};

export const toggleSale = async (
  collection: NFTCollection,
  saleLive: string,
  protectedSaleLive: string
) => {
  return await collection.toggleSale(
    saleLive === "true",
    protectedSaleLive === "true"
  );
};

export const transferOwner = async (
  collection: NFTCollection,
  newOwner: string
) => {
  return await collection.transferOwnership(newOwner);
};

export const withdraw = async (collection: NFTCollection) => {
  return await collection.withdraw();
};

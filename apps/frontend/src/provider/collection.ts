import { ethers } from "ethers";
import { CollectionDetails, Status } from "../types/collections";
import { NFTCollection } from "../types/contracts";

const getCollectionDetails = async (
  collection: NFTCollection,
  provider: ethers.providers.Provider
): Promise<CollectionDetails | undefined> => {
  try {
    const [
      balance,
      maxSupply,
      txLimit,
      baseURI,
      batchSupply,
      giftedAmount,
      name,
      price,
      status,
      symbol,
      totalSupply,
    ] = await Promise.all([
      provider.getBalance(collection.address),
      collection.MAX_SUPPLY(),
      collection.TX_LIMIT(),
      collection.baseURI(),
      collection.batchSupply(),
      collection.giftedAmount(),
      collection.name(),
      collection.price(),
      collection.status(),
      collection.symbol(),
      collection.totalSupply(),
    ]);
    return {
      balance: ethers.utils.formatEther(balance),
      maxSupply: maxSupply.toNumber(),
      txLimit: txLimit.toNumber(),
      baseURI,
      batchSupply: batchSupply.toNumber(),
      giftedAmount: giftedAmount.toNumber(),
      name,
      price: ethers.utils.formatEther(price),
      status,
      symbol,
      totalSupply: totalSupply.toNumber(),
    };
  } catch (e) {
    console.log("ERROR: getCollectionDetails");
    console.log(e);
  }
};

const gift = async (collection: NFTCollection, gifts: string) => {
  return await collection.gift(gifts.split(","));
};

const renounceOwner = async (collection: NFTCollection) => {
  return await collection.renounceOwnership();
};

const setBaseURI = async (collection: NFTCollection, baseURI: string) => {
  return await collection.setBaseURI(baseURI);
};

const setBatchSupply = async (
  collection: NFTCollection,
  batchSupply: string
) => {
  return await collection.setPrice(ethers.utils.parseEther(batchSupply));
};

const setPrice = async (collection: NFTCollection, price: string) => {
  return await collection.setPrice(ethers.utils.parseEther(price));
};

const setStatus = async (collection: NFTCollection, status: Status) => {
  return await collection.setStatus(status);
};

const transferOwner = async (collection: NFTCollection, newOwner: string) => {
  return await collection.transferOwnership(newOwner);
};

const withdraw = async (collection: NFTCollection) => {
  return await collection.withdraw();
};

export {
  getCollectionDetails,
  gift,
  renounceOwner,
  setBaseURI,
  setBatchSupply,
  setPrice,
  setStatus,
  transferOwner,
  withdraw,
};

import { BigNumber } from "ethers";

export type CollectionDetails = {
  balance: string;
  maxSupply: number;
  txLimit: number;
  baseURI: string;
  batchSupply: number;
  giftedAmount: number;
  name: string;
  price: string;
  status: Status;
  symbol: string;
  totalSupply: number;
};

export enum Status {
  "Closed",
  "Protected",
  "Public",
}

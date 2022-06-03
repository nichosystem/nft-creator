import { Signer } from "ethers";
import { CONTRACTS, getNetwork } from "./contracts";

export const deploy = async (
  signer: Signer,
  name: string,
  symbol: string,
  maxSupply: number,
  txLimit: number
) => {
  const factory = await CONTRACTS.nftFactory.connect(signer);
  if (!factory) return;
  let tx = await factory.deploy(
    await signer.getAddress(),
    name,
    symbol,
    maxSupply,
    txLimit
  );
  console.log(tx);
  let receipt = await tx.wait();
  console.log(receipt);
};

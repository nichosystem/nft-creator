import { Signer } from "ethers";
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
    console.log(tx);
    const receipt = await tx.wait();
    console.log(receipt);
  } catch (e) {
    console.log("Factory deploy failed");
    console.error(e);
  }
};

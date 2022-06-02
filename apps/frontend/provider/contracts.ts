import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import { NFTFactory__factory } from "../typechain-types";

// INTERFACES
interface Factory<T> {
  connect(address: string, signerOrProvider: Signer | Provider): T;
}

export interface ContractDetails<T> {
  connect(signerOrProvider: Signer | Provider, network: Networks): T;
  getAddress(network: Networks): string;
}

type ContractAddrs = {
  [key in Networks]: { [key in Contracts]: string };
};

// ENUMS
enum Contracts {
  nftFactory = "nftFactory",
}
enum Networks {
  mainnet = "mainnet",
  rinkeby = "rinkeby",
  polygon = "polygon",
  mumbai = "mumbai",
}

// Constant of all contract addresses for each network
const CONTRACT_ADDRS: ContractAddrs = {
  mainnet: {
    nftFactory: "0x4C70a0A813c94F5598a8A646F287996E7aB987C8",
  },
  rinkeby: {
    nftFactory: "0x4C70a0A813c94F5598a8A646F287996E7aB987C8",
  },
  polygon: {
    nftFactory: "0x4C70a0A813c94F5598a8A646F287996E7aB987C8",
  },
  mumbai: {
    nftFactory: "0x4C70a0A813c94F5598a8A646F287996E7aB987C8",
  },
};

// Main export
export const CONTRACTS = {
  nftFactory: createContractDetails(Contracts.nftFactory, NFTFactory__factory),
};

function createContractDetails<T>(
  contract: Contracts,
  factory: Factory<T>
): ContractDetails<T> {
  return {
    connect: (signerOrProvider, network) =>
      factory.connect(CONTRACT_ADDRS[network][contract], signerOrProvider),
    getAddress: (network) => CONTRACT_ADDRS[network][contract],
  };
}

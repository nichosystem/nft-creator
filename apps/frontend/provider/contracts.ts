import { ethers, Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import { NFTFactory__factory } from "../typechain-types";

// INTERFACES
interface Factory<T> {
  connect(address: string, signerOrProvider: Signer | Provider): T;
}

export interface ContractDetails<T> {
  connect(
    signerOrProvider: Signer | Provider,
    network?: Networks | undefined
  ): Promise<T | undefined>;
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
  goerli = "goerli",
  polygon = "polygon",
  mumbai = "mumbai",
  localhost = "localhost",
}

// Constant of all contract addresses for each network
const CONTRACT_ADDRS: ContractAddrs = {
  mainnet: {
    nftFactory: "",
  },
  goerli: {
    nftFactory: "",
  },
  polygon: {
    nftFactory: "",
  },
  mumbai: {
    nftFactory: "",
  },
  localhost: {
    nftFactory: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
};

// Main export
export const CONTRACTS = {
  nftFactory: createContractDetails(Contracts.nftFactory, NFTFactory__factory),
};

export const getNetwork = async (signerOrProvider: Signer | Provider) => {
  const network =
    signerOrProvider instanceof Signer
      ? await signerOrProvider.provider?.getNetwork()
      : await signerOrProvider.getNetwork();
  if (!network) return;
  switch (network.chainId) {
    case 1:
      return Networks.mainnet;
    case 5:
      return Networks.goerli;
    case 137:
      return Networks.polygon;
    case 80001:
      return Networks.mumbai;
    case 1337:
      return Networks.localhost;
  }
};

function createContractDetails<T>(
  contract: Contracts,
  factory: Factory<T>
): ContractDetails<T> {
  return {
    connect: async (signerOrProvider, network?) => {
      if (!network) network = await getNetwork(signerOrProvider);
      if (!network) return;
      return factory.connect(
        CONTRACT_ADDRS[network][contract],
        signerOrProvider
      );
    },
    getAddress: (network) => CONTRACT_ADDRS[network][contract],
  };
}

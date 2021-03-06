import { ethers, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { NFTFactory__factory } from "../types/contracts";

// INTERFACES
interface Factory<T> {
  connect(address: string, signerOrProvider: Signer | Provider): T;
}

export interface ContractDetails<T> {
  connect(
    signer: Signer,
    network?: Networks | undefined
  ): Promise<T | undefined>;
  connectReadOnly(
    provider: Provider,
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
  localhost = "localhost",
}

// Constant of all contract addresses for each network
const CONTRACT_ADDRS: ContractAddrs = {
  mainnet: {
    nftFactory: "",
  },
  goerli: {
    nftFactory: "0x4f17e8e976b809408D4aa3485BFF9326dF8AB505",
  },
  polygon: {
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

export const getNetwork = async (
  network: ethers.providers.Network | undefined
) => {
  if (!network) return;
  switch (network.chainId) {
    case 1:
      return Networks.mainnet;
    case 5:
      return Networks.goerli;
    case 137:
      return Networks.polygon;
    default:
      return Networks.localhost;
  }
};

function createContractDetails<T>(
  contract: Contracts,
  factory: Factory<T>
): ContractDetails<T> {
  return {
    connect: async (signer, network?) => {
      try {
        if (!network) {
          network = await getNetwork(await signer.provider?.getNetwork());
          if (!network) return;
        }
        return factory.connect(CONTRACT_ADDRS[network][contract], signer);
      } catch (e) {
        console.log("ERROR: connect");
        console.log(e);
      }
    },
    connectReadOnly: async (provider, network?) => {
      try {
        if (!network) {
          network = await getNetwork(await provider.getNetwork());
          if (!network) return;
        }
        return factory.connect(CONTRACT_ADDRS[network][contract], provider);
      } catch (e) {
        console.log("ERROR: connectReadOnly");
        console.log(e);
      }
    },
    getAddress: (network) => CONTRACT_ADDRS[network][contract],
  };
}

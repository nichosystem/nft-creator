import Link from "next/link";
import { Layout, NextPageWithLayout } from "../types/types";
import {
  BeakerIcon,
  CodeIcon,
  CogIcon,
  GiftIcon,
  TemplateIcon,
  PuzzleIcon,
} from "@heroicons/react/outline";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

const Hero = () => {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      <div className="relative pt-24 sm:pb-32">
        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
          <div className="text-center">
            <Logo />
            <h1 className="text-4xl tracking-tight font-extrabold text-slate-100 sm:text-5xl md:text-6xl">
              <span className="block leading-snug">No-Code Tools for </span>{" "}
              <span className="block text-sky-400">NFT Creators</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-slate-200 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Create an NFT collection in minutes. Generate art, deploy smart
              contracts, and manage on-chain operations all through one simple
              interface.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/deployer" passHref>
                  <button className="mt-2 font-extralight tracking-widest uppercase flex-shrink-0 px-4 py-2 border border-transparent text-xl rounded-md shadow-sm text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                    Enter dApp
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const features = [
  {
    name: "Deploy Smart Contract",
    description:
      "Click to deploy an ERC721 smart contract to your desired chain.",
    icon: CodeIcon,
  },
  {
    name: "Manage Collections",
    description:
      "Get stats and manage your collection under a single dashboard.",
    icon: CogIcon,
  },
  {
    name: "Define Metadata",
    description:
      "Create and upload your collection's metadata and art to IPFS for safe storage.",
    icon: PuzzleIcon,
  },
  {
    name: "Generate Art",
    description:
      "Input image layers and adjust rarities to create a full generative collection.",
    icon: BeakerIcon,
  },
  {
    name: "Create Minting App",
    description:
      "Use a templated web app that lets users mint NFTs directly from your website.",
    icon: TemplateIcon,
  },
  {
    name: "Snapshot & Airdrop",
    description:
      "Take a snapshot of any collection's holders for voting or sending out airdrops.",
    icon: GiftIcon,
  },
];
const Features = () => {
  return (
    <div className="relative bg-slate-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base font-semibold uppercase tracking-wider text-sky-400">
          Build faster
        </h2>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
          Everything you need to create an NFT collection
        </p>
        <p className="mx-auto mt-5 max-w-prose text-xl text-slate-400">
          A tool for every need you have as an NFT creator, including smart
          contracts, art generation, and a custom minting dApp – all without
          writing a single line of code.
        </p>
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-sky-500 p-3 shadow-lg">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CTA = () => {
  return (
    <div className="bg-slate-900">
      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl tracking-normal text-slate-100 sm:text-4xl">
          <span className="block">Ready for the best part?</span>
          <span className="block font-extrabold">
            It&apos;s completely free.
          </span>
        </h2>
        <div className="mt-4 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <Link href="/deployer" passHref>
              <button className="mt-2 font-semibold italic tracking-widest flex-shrink-0 px-4 py-2 border border-transparent text-xl rounded-md shadow-sm text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                WAGMI MFERS
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Hero />
      <Features />
      <CTA />
    </>
  );
};

const Layout: Layout = ({ children }) => {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
};

Home.Layout = Layout;
export default Home;

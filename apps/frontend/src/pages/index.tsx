import Link from "next/link";
import { Layout, NextPageWithLayout } from "@/types/types";
import {
  BeakerIcon,
  CodeIcon,
  CogIcon,
  GiftIcon,
  TemplateIcon,
  PuzzleIcon,
} from "@heroicons/react/outline";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";

const features = [
  {
    name: "Deploy Smart Contracts",
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
    name: "Build Metadata",
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
    name: "Create Minting dApps",
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

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Hero />
      {/* Features */}
      <div className="relative py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-base font-semibold uppercase tracking-wider text-sky-400">
            Launch faster
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
              {features.map((feature, i) => (
                <div key={feature.name} className="pt-6">
                  <div className="group relative flow-root rounded-lg border border-slate-800 px-6 pb-8">
                    <div className="absolute -inset-px -z-10 rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] [--quick-links-hover-bg:theme(colors.slate.800)] group-hover:opacity-100" />
                    <div>
                      <div className="-mt-6">
                        <div>
                          <span className="inline-flex items-center justify-center rounded-md bg-sky-500 p-3 shadow-lg">
                            <feature.icon
                              className="h-6 w-6 text-white"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                        <h3 className="mt-6 font-display text-lg font-medium tracking-tight text-white">
                          {feature.name}
                        </h3>
                        <p className="mt-4 text-base text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* CTA */}
      <div className="mx-auto mb-20 max-w-7xl py-12 px-4 text-center sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl tracking-normal text-slate-100 sm:text-4xl">
          <span className="block">Ready for the best part?</span>
          <span className="block font-extrabold">
            It&apos;s completely free.
          </span>
        </h2>
        <div className="mt-4 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <Link href="/dapp" passHref>
              <button className="mt-2 flex-shrink-0 rounded-md border border-transparent bg-sky-500 px-4 py-2 text-xl font-semibold italic tracking-widest text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                WAGMI MFERS
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const Layout: Layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

Home.Layout = Layout;
export default Home;

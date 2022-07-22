import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

export const navigation = [
  {
    title: "Introduction",
    links: [{ title: "Getting started", href: "/docs" }],
  },
  {
    title: "Guides",
    links: [
      {
        title: "Deploying smart contracts",
        href: "/docs/deploy-contract",
      },
      { title: "Managing collections", href: "/docs/manage-collection" },
      { title: "Generating NFT art", href: "/docs/generate-art" },
      { title: "Uploading metadata", href: "/docs/upload-metadata" },
      { title: "Sending airdrops", href: "/docs/airdrops" },
      { title: "Creating a minting dApp", href: "/docs/create-minting-dapp" },
    ],
  },
  {
    title: "Technical reference",
    links: [
      { title: "Contract addresses", href: "/docs/contracts" },
      { title: "NFTFactory", href: "/docs/nft-factory" },
      { title: "NFTCollection", href: "/docs/nft-collection" },
    ],
  },
];

export function SidebarNav() {
  let router = useRouter();

  return (
    <nav className="w-64 pr-8 text-base lg:text-sm xl:w-72 xl:pr-16">
      <ul role="list" className="space-y-9">
        {navigation.map((section) => (
          <li key={section.title}>
            <h2 className="font-display font-medium text-white">
              {section.title}
            </h2>
            <ul
              role="list"
              className="mt-2 space-y-2 border-l-2 border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
            >
              {section.links.map((link) => (
                <li key={link.href} className="relative">
                  <Link href={link.href}>
                    <a
                      className={clsx(
                        "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                        link.href === router.pathname
                          ? "font-semibold text-sky-500 before:bg-sky-500"
                          : "text-slate-400 before:hidden before:bg-slate-700 hover:text-slate-300 hover:before:block"
                      )}
                    >
                      {link.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

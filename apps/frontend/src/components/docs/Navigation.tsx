import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

const navigation = [
  {
    title: "Introduction",
    links: [{ title: "Getting started", href: "/docs" }],
  },
  {
    title: "Core tools",
    links: [
      { title: "Deployer", href: "/docs/deployer" },
      {
        title: "Manager",
        href: "/docs/manager",
      },
      { title: "Generator", href: "/docs/generator" },
      {
        title: "Minter",
        href: "/docs/minter",
      },
      { title: "Snapshot", href: "/docs/snapshot" },
    ],
  },
  {
    title: "Advanced guides",
    links: [
      { title: "Deploying smart contracts", href: "/docs/coming-soon" },
      { title: "Generating NFT art", href: "/docs/coming-soon" },
      { title: "Managing collections", href: "/docs/coming-soon" },
      { title: "Uploading to IPFS", href: "/docs/coming-soon" },
      {
        title: "Airdropping rewards",
        href: "/docs/coming-soon",
      },
    ],
  },
  {
    title: "Technical reference",
    links: [
      { title: "Contracts", href: "/docs/contracts" },
      { title: "NFT Factory", href: "/docs/coming-soon" },
      { title: "NFT Collection", href: "/docs/coming-soon" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Links", href: "/docs/coming-soon" },
      { title: "How to contribute", href: "/docs/coming-soon" },
    ],
  },
];

export function Navigation() {
  let router = useRouter();

  return (
    <nav className="w-64 pr-8 text-base lg:text-sm xl:w-72 xl:pr-16">
      <ul role="list" className="space-y-9">
        {navigation.map((section) => (
          <li key={section.title}>
            <h2 className="font-display font-medium text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <ul
              role="list"
              className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
            >
              {section.links.map((link) => (
                <li key={link.href} className="relative">
                  <Link href={link.href}>
                    <a
                      className={clsx(
                        "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                        link.href === router.pathname
                          ? "font-semibold text-sky-500 before:bg-sky-500"
                          : "text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
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

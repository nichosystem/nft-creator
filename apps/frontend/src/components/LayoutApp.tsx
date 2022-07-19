import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  TemplateIcon,
  BeakerIcon,
  HomeIcon,
  MenuAlt2Icon,
  CameraIcon,
  CodeIcon,
  XIcon,
  CogIcon,
  BookOpenIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Footer from "./Footer";
import { getOwnedCollections } from "../provider/factory";
import { useAccount, useProvider } from "wagmi";
import { Layout } from "@/components/docs/Layout";
import { MarkdocNextJsPageProps } from "@markdoc/next.js";

const sidebarNavigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Deployer", href: "/deployer", icon: CodeIcon },
  { name: "Generator", href: "/generator", icon: BeakerIcon },
  { name: "Minter", href: "/minter", icon: TemplateIcon },
  { name: "Snapshot", href: "/snapshot", icon: CameraIcon },
  { name: "Docs", href: "/docs", icon: BookOpenIcon },
];

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function LayoutApp({
  children,
  pageProps,
}: {
  children: React.ReactNode;
  pageProps: MarkdocNextJsPageProps;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const provider = useProvider();
  const { data: account } = useAccount();

  // Display manager if the user has deployed a collection
  useEffect(() => {
    const f = async () => {
      if (!provider || !account?.address) return;
      const c = await getOwnedCollections(provider, account.address);
      if (c && !sidebarNavigation.some((n) => n.href === "/manager")) {
        sidebarNavigation.splice(1, 0, {
          name: "Manager",
          href: "/manager",
          icon: CogIcon,
        });
      }
    };
    f();
  }, [provider, account?.address]);

  // Use different layout for docs pages
  // pageProps must be passed down here because markdoc pages don't have TSX components
  if (router.pathname.startsWith("/docs"))
    return <Layout pageProps={pageProps}>{children}</Layout>;

  // Return normal layout for all other pages
  return (
    <>
      <div className="flex h-full min-h-screen">
        {/* Narrow sidebar */}
        <div className="fixed hidden h-screen w-28 overflow-y-auto bg-slate-900 md:block">
          <div className="flex w-full flex-col items-center py-6">
            <div className="flex flex-shrink-0 items-center"></div>
            <div className="mt-6 w-full flex-1 space-y-1 px-2">
              {sidebarNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.href === router.pathname
                      ? "bg-sky-500 text-white"
                      : "text-indigo-100 hover:bg-sky-500 hover:text-white",
                    "group flex w-full flex-col items-center rounded-md p-3 text-xs font-medium"
                  )}
                  aria-current={
                    item.href === router.pathname ? "page" : undefined
                  }
                >
                  <item.icon
                    className={classNames(
                      item.href === router.pathname
                        ? "text-white"
                        : "text-indigo-300 group-hover:text-white",
                      "h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  <span className="mt-2">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-20 md:hidden"
            onClose={setMobileMenuOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700 pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-1 right-0 -mr-14 p-1">
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Close sidebar</span>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                    <nav className="flex h-full flex-col">
                      <div className="space-y-1">
                        {sidebarNavigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.href === router.pathname
                                ? "bg-indigo-800 text-white"
                                : "text-indigo-100 hover:bg-indigo-800 hover:text-white",
                              "group flex items-center rounded-md py-2 px-3 text-sm font-medium"
                            )}
                            aria-current={
                              item.href === router.pathname ? "page" : undefined
                            }
                          >
                            <item.icon
                              className={classNames(
                                item.href === router.pathname
                                  ? "text-white"
                                  : "text-indigo-300 group-hover:text-white",
                                "mr-3 h-6 w-6"
                              )}
                              aria-hidden="true"
                            />
                            <span>{item.name}</span>
                          </a>
                        ))}
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Content area */}
        <div className="flex flex-1 flex-col pt-20 md:ml-28">
          <button
            type="button"
            className="absolute top-5 left-0 border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="absolute top-5 right-5">
            <ConnectButton />
          </div>

          {/* Main content */}
          <div className="flex flex-1 items-stretch">
            <main className="flex-1 pb-10 text-gray-100">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

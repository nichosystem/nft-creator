import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  TemplateIcon,
  BeakerIcon,
  HomeIcon,
  MenuAlt2Icon,
  CameraIcon,
  CodeIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const sidebarNavigation = [
  { name: "Manager", href: "/dapp", icon: HomeIcon },
  { name: "Generator", href: "/dapp/generator", icon: BeakerIcon },
  { name: "Deployer", href: "/dapp/deployer", icon: CodeIcon },
  { name: "Snapshot", href: "/dapp/snapshot", icon: CameraIcon },
  { name: "Minting App", href: "/dapp/minting", icon: TemplateIcon },
];

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="h-full min-h-screen flex">
        {/* Narrow sidebar */}
        <div className="hidden md:block w-28 bg-indigo-700 dark:bg-slate-900 overflow-y-auto fixed h-screen">
          <div className="w-full py-6 flex flex-col items-center">
            <div className="flex-shrink-0 flex items-center"></div>
            <div className="flex-1 mt-6 w-full px-2 space-y-1">
              {sidebarNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.href === router.pathname
                      ? "bg-sky-500 text-white"
                      : "text-indigo-100 hover:bg-sky-500 hover:text-white",
                    "group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium"
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
                <Dialog.Panel className="relative max-w-xs w-full bg-indigo-700 pt-5 pb-4 flex-1 flex flex-col">
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
                        className="h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
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
                  <div className="mt-5 flex-1 h-0 px-2 overflow-y-auto">
                    <nav className="h-full flex flex-col">
                      <div className="space-y-1">
                        {sidebarNavigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.href === router.pathname
                                ? "bg-indigo-800 text-white"
                                : "text-indigo-100 hover:bg-indigo-800 hover:text-white",
                              "group py-2 px-3 rounded-md flex items-center text-sm font-medium"
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
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Content area */}
        <div className="flex-1 flex flex-col pt-20 md:ml-28">
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
          <div className="flex-1 flex items-stretch">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState } from "react";
import {
  TemplateIcon,
  BeakerIcon,
  HomeIcon,
  CameraIcon,
  CodeIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import clsx from "clsx";

export const navigation = [
  { name: "Manager", href: "/manager", icon: HomeIcon },
  { name: "Deployer", href: "/deployer", icon: CodeIcon },
  { name: "Generator", href: "/generator", icon: BeakerIcon },
  { name: "Minter", href: "/minter", icon: TemplateIcon },
  { name: "Snapshot", href: "/snapshot", icon: CameraIcon },
];

export default function LayoutApp({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Header />
      <div className="flex h-full min-h-screen">
        {/* Sidebar */}
        <div className="fixed hidden h-screen w-28 overflow-y-auto md:block">
          <div className="flex w-full flex-col items-center py-6">
            <div className="flex flex-shrink-0 items-center"></div>
            <div className="mt-6 w-full flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={clsx(
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
                    className={clsx(
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

        {/* Content area */}
        <div className="flex flex-1 flex-col pt-10 md:ml-28">
          <div className="flex flex-1 items-stretch">
            <main className="flex-1 pb-10 text-gray-100">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

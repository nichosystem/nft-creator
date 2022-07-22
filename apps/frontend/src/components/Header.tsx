import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { MobileNavigation } from "@/components/docs/MobileNavigation";
import { Search } from "@/components/docs/Search";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";

export function Header() {
  let [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-none shadow-slate-900/5 transition duration-500 sm:px-6 lg:px-8",
        isScrolled
          ? "[@supports(backdrop-filter:blur(0))]:bg-slate-900/75 bg-slate-900/95 backdrop-blur"
          : "bg-transparent"
      )}
    >
      <div className="mr-6 flex lg:hidden">
        <MobileNavigation />
      </div>
      <div className="relative flex flex-grow basis-0 items-center">
        <Link href="/" passHref aria-label="Home page">
          <a>
            <Logo />
          </a>
        </Link>
      </div>
      <div className="-my-5 mr-6 items-center sm:mr-8 md:mr-0">
        {router.pathname !== "/" && <Search />}
      </div>
      <div className="relative flex basis-0 items-center justify-end gap-6 sm:gap-8 md:flex-grow">
        <>
          <Link href="/dapp" passHref aria-label="Docs">
            <a className="text-sm font-semibold text-gray-100 hover:text-sky-500">
              Dapp
            </a>
          </Link>
          <Link href="/docs" passHref aria-label="Docs">
            <a className="text-sm font-semibold text-gray-100 hover:text-sky-500">
              Docs
            </a>
          </Link>
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="address"
            label="Connect"
          />
        </>
      </div>
    </header>
  );
}

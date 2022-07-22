import React from "react";
import { useRouter } from "next/router";
import { MarkdocNextJsPageProps } from "@markdoc/next.js";
import { LayoutDocs } from "@/components/docs/LayoutDocs";
import LayoutApp from "./dapp/LayoutDapp";

export default function Layout({
  children,
  pageProps,
}: {
  children: React.ReactNode;
  pageProps: MarkdocNextJsPageProps;
}) {
  const router = useRouter();

  // Use different layout for docs pages
  // pageProps must be passed down here because markdoc pages don't have TSX components
  if (router.pathname.startsWith("/docs"))
    return <LayoutDocs pageProps={pageProps}>{children}</LayoutDocs>;

  // Return normal layout for all other pages
  return <LayoutApp>{children}</LayoutApp>;
}

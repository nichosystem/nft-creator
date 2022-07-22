import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import Head from "next/head";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  connectorsForWallets,
  wallet,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { ToastContainer } from "react-toastify";
import { createClient, chain, configureChains, WagmiConfig } from "wagmi";
import { MarkdocNextJsPageProps } from "@markdoc/next.js";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { NextPageWithLayout } from "../types/types";
import "@/styles/tailwind.css";

// wagmi
const selectChains = [chain.mainnet, chain.polygon, chain.goerli];
if (process.env.NEXT_PUBLIC_ENV === "development")
  selectChains.push(chain.localhost);
const { provider, chains } = configureChains(selectChains, [
  alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  publicProvider(),
]);
const needsInjectedWalletFallback =
  typeof window !== "undefined" &&
  window.ethereum &&
  !window.ethereum.isMetaMask &&
  !window.ethereum.isCoinbaseWallet;
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      wallet.metaMask({ chains }),
      wallet.walletConnect({ chains }),
      wallet.coinbase({ appName: "NFT Creator dApp", chains }),
      wallet.rainbow({ chains }),
      ...(needsInjectedWalletFallback ? [wallet.injected({ chains })] : []),
    ],
  },
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPageWithLayout;
  pageProps: MarkdocNextJsPageProps;
}) {
  const PageLayout = Component.Layout ?? Layout;
  return (
    <>
      <Head>
        <title>NFT Creator</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          coolMode
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          }}
        >
          <ToastContainer theme="dark" />
          <PageLayout pageProps={pageProps}>
            <Component {...pageProps} />
          </PageLayout>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;

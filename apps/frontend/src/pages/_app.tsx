import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Head from "next/head";
import "@rainbow-me/rainbowkit/styles.css";
import {
  apiProvider,
  configureChains,
  RainbowKitProvider,
  connectorsForWallets,
  wallet,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { createClient, chain, WagmiProvider } from "wagmi";
import "../styles/globals";
import { useEffect } from "react";

const selectChains = [
  chain.mainnet,
  chain.goerli,
  chain.polygon,
  chain.polygonMumbai,
];
if (process.env.NEXT_PUBLIC_ENV === "development")
  selectChains.push(chain.localhost);
const { provider, chains } = configureChains(selectChains, [
  apiProvider.alchemy(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY),
  apiProvider.fallback(),
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
      wallet.coinbase({ appName: "NFT Tools dApp", chains }),
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

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.querySelector("body")?.classList.add("dark:bg-slate-900");
  });

  return (
    <>
      <Head>
        <title>NFT Tools</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WagmiProvider client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          coolMode
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </WagmiProvider>
    </>
  );
}

export default App;

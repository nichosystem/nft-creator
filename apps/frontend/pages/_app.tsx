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
} from "@rainbow-me/rainbowkit";
import { createClient, chain, WagmiProvider } from "wagmi";
import "../styles/globals.css";

const { provider, chains } = configureChains(
  [chain.mainnet, chain.rinkeby, chain.polygon, chain.polygonMumbai],
  [apiProvider.alchemy(process.env.ALCHEMY_ID), apiProvider.fallback()]
);

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
      wallet.coinbase({ appName: "My RainbowKit App", chains }),
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
  return (
    <>
      <Head>
        <title>NFT Tools</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WagmiProvider client={wagmiClient}>
        <RainbowKitProvider chains={chains} coolMode>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </WagmiProvider>
    </>
  );
}

export default App;

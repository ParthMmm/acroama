import '../styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import '@rainbow-me/rainbowkit/styles.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { apolloClient } from '@api/client';
import Layout from '@components/Layout';

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [alchemyProvider(process.env.ALCHEMY_KEY), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({ accentColor: 'green' })}
      >
        <ApolloProvider client={apolloClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default MyApp;

import '@rainbow-me/rainbowkit/styles.css';
import { ApolloProvider } from '@apollo/client';
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { apolloClient } from '@api/client';

import { ReactNode, Suspense } from 'react';
type Props = {};

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
function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({ accentColor: 'green' })}
      >
        <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default Providers;

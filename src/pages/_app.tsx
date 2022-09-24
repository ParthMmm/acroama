import '../styles/globals.css';
import '../styles/nprogress.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import '@rainbow-me/rainbowkit/styles.css';

import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import superjson from 'superjson';
import type { AppRouter } from '../server/router';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Spinner from '@components/Spinner';
import { useAppPersistStore } from 'src/store/app';

import NProgress from '../components/nprogress';
import Layout from '@components/Layout';

const MyApp: AppType = ({ Component, pageProps }) => {
  // rehydrateState();

  return (
    <Layout>
      <Component {...pageProps} />
      <NProgress />
    </Layout>
  );
};

export default MyApp;

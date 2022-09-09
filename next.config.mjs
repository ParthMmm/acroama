import { env } from './src/env/server.mjs';
import withBundleAnalyzer from '@next/bundle-analyzer';
/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

function defineNextConfig(config) {
  return bundleAnalyzer(config);
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      's1.ticketm.net',
      'assets0.dostuffmedia.com',
      'pbs.twimg.com',
      'lens.infura-ipfs.io',
    ],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
});

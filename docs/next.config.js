// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  poweredByHeader: false,
  reactStrictMode: true,
  assetPrefix: './',
  basePath: process.env.NODE_ENV === 'production' ? '/purehtml' : '',
};

export default nextConfig;

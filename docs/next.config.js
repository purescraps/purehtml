// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export',
  distDir: 'dist',
  basePath: process.env.NODE_ENV === 'production' ? '/purehtml' : '',
  poweredByHeader: false,
  reactStrictMode: true,
  assetPrefix: './',
};

export default nextConfig;

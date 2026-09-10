import { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  poweredByHeader: false,
  reactStrictMode: true,
  assetPrefix: './',
  basePath: process.env.NODE_ENV === 'production' ? '/purehtml' : '',
};

export default nextConfig;

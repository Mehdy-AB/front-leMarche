import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, 
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  images: {
    domains: ['img.leboncoin.fr','res.cloudinary.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;

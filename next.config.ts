import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    dynamicIO: true,
  },
  // ignore ts errors on build
  typescript: {
    ignoreBuildErrors: true,
  },
  // ignore eslint errors on build
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
};

export default nextConfig;

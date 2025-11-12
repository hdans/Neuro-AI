import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apps.himatif.org',
        pathname: '/himatif-database'
      },
    ],
  },
};

export default nextConfig;

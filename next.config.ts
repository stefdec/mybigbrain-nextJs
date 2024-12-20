import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: process.env.AWS_PHOTO_BUCKET_URL || 'bb-faces-test-b.s3.us-east-1.amazonaws.com',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push({
      'node:crypto': 'commonjs crypto',
    });
    return config;
  },
};


export default nextConfig;

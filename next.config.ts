import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable image optimization
    formats: ['image/avif', 'image/webp'],
    // Allow images from any domain (if you need to load external images)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Optional: Configure page extensions if you're using MDX
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  // Optional: Enable React Strict Mode
  reactStrictMode: true,
};

export default nextConfig;
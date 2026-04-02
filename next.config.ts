import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  reactStrictMode: true,
  experimental: {
    // Automatically tree-shake large packages — only the icons/components actually
    // used end up in the bundle instead of the entire package
    optimizePackageImports: [
      'lucide-react',
      'react-syntax-highlighter',
      '@radix-ui/react-dropdown-menu',
    ],
  },
};

export default nextConfig;

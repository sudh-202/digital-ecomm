/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Allow serving files from the data directory
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|webp)$/i,
      type: 'asset/resource',
    });
    return config;
  },
  // Configure static file serving
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/data/uploads/:path*',
      },
    ];
  },
}

module.exports = nextConfig
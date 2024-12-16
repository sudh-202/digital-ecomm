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
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  // Enable static file serving from data directory
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
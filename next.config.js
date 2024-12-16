/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['localhost'],
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
        source: '/data/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
}

module.exports = nextConfig
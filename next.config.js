/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
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
        source: '/data/:path*',
        destination: '/data/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: '/data/uploads/:path*',
      },
    ];
  },
  eslint: {
    // Disable the rule for unescaped entities
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
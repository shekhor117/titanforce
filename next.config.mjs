/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
  },
  compress: true,
  productionBrowserSourceMaps: false,
  async redirects() {
    return [
      {
        source: '/players',
        destination: '/team-squad',
        permanent: false,
      },
      {
        source: '/squad',
        destination: '/team-squad',
        permanent: false,
      },
      {
        source: '/fixtures',
        destination: '/fixtures-results',
        permanent: false,
      },
    ]
  },
}

export default nextConfig

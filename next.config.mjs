/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Explicitly use proxy instead of middleware
  experimental: {
    useProxy: true,
  },
}

export default nextConfig

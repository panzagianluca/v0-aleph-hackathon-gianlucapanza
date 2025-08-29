/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@cid-sentinel/core'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

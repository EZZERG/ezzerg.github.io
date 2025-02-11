import { type NextConfig } from "next"

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath: '/ezzerg.github.io',
  assetPrefix: '/ezzerg.github.io/',
}

export default nextConfig

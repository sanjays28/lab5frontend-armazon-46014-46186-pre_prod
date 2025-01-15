/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure compatibility with Material-UI
  compiler: {
    emotion: true,
  },
  // Enable static generation for performance
  output: 'standalone',
  // Configure image optimization
  images: {
    domains: ['localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Environment configuration
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000',
  },
  // Configure webpack for SSR
  webpack: (config, { isServer }) => {
    // Optimize SSR imports
    if (isServer) {
      config.externals = [...config.externals, 'react', 'react-dom'];
    }
    return config;
  },
}

module.exports = nextConfig

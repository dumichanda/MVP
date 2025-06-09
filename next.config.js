/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'cloudflare:sockets': false,
    };
    
    // Add externals configuration for client-side builds
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push('cloudflare:sockets');
    }
    
    return config;
  },
};

module.exports = nextConfig;
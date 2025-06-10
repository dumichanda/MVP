/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  webpack: (config, { webpack, isServer }) => {
    // Fix for cloudflare:sockets webpack error with Neon DB
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$|^pg-cloudflare$/,
      })
    );

    // Additional fallbacks for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Exclude problematic modules from server bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('pg-native', 'cloudflare:sockets', 'pg-cloudflare');
    }

    return config;
  },
  
  // Experimental settings for better Neon DB compatibility
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
}

module.exports = nextConfig

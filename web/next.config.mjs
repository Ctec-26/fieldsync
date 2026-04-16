/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      os: false,
      "pino-pretty": false,
    };
    return config;
  },
  experimental: {
    esmExternals: "loose",
  },
};

export default nextConfig;

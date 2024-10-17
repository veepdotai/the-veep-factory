/** @type {import('next').NextConfig} */
const nextConfig = {
//    basePath: '/v/previous',
//    assetPrefix: '/v/previous',
    reactStrictMode: false,
    distDir: 'dist',
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true
    },
/*    webpack5: true,*/
    webpack: (config) => {
      config.resolve.fallback = { fs: false };
      config.resolve.symlinks = true
      return config;
    },
    "typescript": {
      "ignoreBuildErrors": true
    }
};
/*
module.exports = {
    async rewrites() {
      return [
        {
          source: '/:any*',
          destination: '/index2',
        },
      ];
    },
};
*/
module.exports = nextConfig;

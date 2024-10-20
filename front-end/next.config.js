/** @type {import('next').NextConfig} */
const nextConfig = {
    //basePath: '/v/241018-0409-5b42cf1e',
    //assetPrefix: '/v/241018-0409-5b42cf1e',
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

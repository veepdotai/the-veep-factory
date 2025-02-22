/** @type {import('next').NextConfig} */
const nextConfig = {
//    basePath: '',
//    assetPrefix: '',
    reactStrictMode: true,
    distDir: 'dist',
    output: 'export',
    trailingSlash: true,
    //compress: false,
    images: {
        unoptimized: true
    },
/*    webpack5: true,*/
    webpack: (config) => {
      config.resolve.fallback = { fs: false };
      config.resolve.symlinks = true
      //config.optimization.minimize = false
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

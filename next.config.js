/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/bible-web-app/' : '',
  basePath: '/bible-web-app',
  trailingSlash: true
}

module.exports = nextConfig
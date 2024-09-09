/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: 'dist',
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;

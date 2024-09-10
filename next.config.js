/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: '.next',
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;

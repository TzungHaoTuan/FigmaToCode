/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Enable ESLint during production builds
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;

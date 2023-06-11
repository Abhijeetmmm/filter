/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["trovenapp.s3.amazonaws.com"],
  },
};

module.exports = nextConfig;

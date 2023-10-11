/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 1923542925,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "42ad9a241aa20f15945e996b06565087",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;

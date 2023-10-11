/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {},
  images: {
    domains: [
      "localhost",
      "whatsapp-clone-front-end-zeta.vercel.app",
      "whatsapp-clone-back-end-production.up.railway.app",
    ],
  },
};

module.exports = nextConfig;

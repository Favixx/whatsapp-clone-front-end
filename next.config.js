/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: process.env.NEXT_PUBLIC_ZEGO_APP_ID,
    NEXT_PUBLIC_ZEGO_SERVER_ID: process.env.NEXT_PUBLIC_ZEGO_SERVER_ID,
  },
  images: {
    domains: [
      "localhost",
      "whatsapp-clone-front-end-zeta.vercel.app",
      "whatsapp-clone-backend-ofh9.onrender.com",
    ],
  },
};

module.exports = nextConfig;

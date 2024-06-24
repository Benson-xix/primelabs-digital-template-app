/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: '3000',
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "primelabs-digital-template-app-production.up.railway.app",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "qodebyte.com",
        pathname: "**",
      },
      {
      protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
      }
    ],
  },
};

export default nextConfig;

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
        hostname: "primelabs-digital-template-app.onrender.com",
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
   assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '', // update this if you use subpath routing
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '', // update this if you use subpath routing
    publicRuntimeConfig: {
      staticFolder: '/media', // Or the correct path
    },
};

export default nextConfig;

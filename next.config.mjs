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
        hostname: "primelabs-digital-templete-app-production.up.railway.app",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "primelabs-digital-template-app.vercel.app",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;

/**** @type {import('next').NextConfig} ****/
const nextConfig = {


  images: {

    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
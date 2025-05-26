import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Recommended for i18n routing, but we handle language via context for this app
  // i18n: {
  //   locales: ['en', 'ar'],
  //   defaultLocale: 'ar',
  // },
};

export default nextConfig;

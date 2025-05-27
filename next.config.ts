
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Not needed for Vercel; Vercel handles standard Next.js builds.
  // trailingSlash: true, // Generally not needed with Vercel's default routing.
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // unoptimized: true, // Not needed for Vercel; Vercel supports Next.js image optimization.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The basePath and assetPrefix are typically for specific subfolder deployments like GitHub Pages,
  // and generally not required for standard Vercel deployments to a root domain or subdomain.
  // basePath: '/KsaTest',
  // assetPrefix: '/KsaTest',

  // Recommended for i18n routing, but we handle language via context for this app
  // i18n: {
  //   locales: ['en', 'ar'],
  //   defaultLocale: 'ar',
  // },
};

export default nextConfig;

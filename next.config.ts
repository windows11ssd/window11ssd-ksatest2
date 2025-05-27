
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Disable Next.js image optimization for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // If deploying to a GitHub Pages repository page (e.g., your-username.github.io/your-repo-name),
  // you'll need to uncomment and set the basePath:
  // basePath: '/your-repo-name',
  // assetPrefix: '/your-repo-name/', // Also needed for assets if using basePath

  // Recommended for i18n routing, but we handle language via context for this app
  // i18n: {
  //   locales: ['en', 'ar'],
  //   defaultLocale: 'ar',
  // },
};

export default nextConfig;

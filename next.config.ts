
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export
  trailingSlash: true, // Ensures page URLs end with a '/'
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
  // you'll need to uncomment and set the basePath and assetPrefix.
  // For example, if your repository is 'KsaTest':
  // basePath: '/KsaTest',
  // assetPrefix: '/KsaTest', // Set to the same as basePath if assets are served from the same path prefix

  // Recommended for i18n routing, but we handle language via context for this app
  // i18n: {
  //   locales: ['en', 'ar'],
  //   defaultLocale: 'ar',
  // },
};

export default nextConfig;

import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/hooks/use-translation';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'KsaTest',
  description: 'Test your internet speed with KsaTest.',
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' }, // Assuming light theme background is white for theme-color consistency
    { media: '(prefers-color-scheme: dark)', color: '#fb8500' }  // Primary color for dark theme
  ],
  appleWebApp: {
    capable: true,
    title: 'KsaTest',
    statusBarStyle: 'default',
    // You can add startup images here if needed:
    // startupImage: [
    //   '/apple-touch-startup-image.png',
    // ],
  },
  icons: {
    icon: '/icon-192x192.png', // General purpose icon
    apple: '/apple-touch-icon.png', // For Apple devices
  },
  formatDetection: {
    telephone: false,
  },
  // Ensuring the viewport is set appropriately for PWAs
  // Next.js handles the basic viewport meta tag well.
  // For more specific PWA viewport needs like 'viewport-fit=cover',
  // you might need to add a <meta name="viewport" ...> tag directly in the <head>
  // if Next.js metadata API doesn't cover it. For now, default Next.js viewport is usually sufficient.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="ar" dir="rtl" suppressHydrationWarning>
        {/* Next.js automatically adds <head> and populates it from metadata */}
        <body className={`${GeistSans.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </LanguageProvider>
  );
}

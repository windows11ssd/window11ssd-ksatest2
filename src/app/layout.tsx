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
  },
  icons: {
    icon: '/icon-192x192.png', // General purpose icon
    apple: '/apple-touch-icon.png', // For Apple devices
  },
  formatDetection: {
    telephone: false,
  },
  // Explicitly set viewport for proper scaling
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="ar" dir="rtl" suppressHydrationWarning> {/* Default to 'ar' as per useLocalStorage initial value */}
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

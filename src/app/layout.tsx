import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/hooks/use-translation';
import { Toaster } from '@/components/ui/toaster';

// geistSans itself is an object with properties like .variable
// It's not a function to be called.
// The variable property will be something like '--font-geist-sans'

export const metadata: Metadata = {
  title: 'NetGauge',
  description: 'Test your internet speed with NetGauge.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // LanguageProvider now wraps the html element directly.
    // The lang and dir attributes on <html> will be initially set here (defaults, e.g., 'ar', 'rtl')
    // and then updated by LanguageProvider's useEffect after hydration if necessary.
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

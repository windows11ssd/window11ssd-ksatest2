import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Corrected import from geist
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/hooks/use-translation';
import { Toaster } from '@/components/ui/toaster';

const geistSans = GeistSans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});


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
    <LanguageProvider>
      {(lang, dir) => (
        <html lang={lang} dir={dir} suppressHydrationWarning>
          <body className={`${geistSans.variable} font-sans antialiased`}>
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
      )}
    </LanguageProvider>
  );
}

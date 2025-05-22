import '../styles/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster expand={true} richColors position="top-center" />
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}

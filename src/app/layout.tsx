import '../styles/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Plus_Jakarta_Sans } from 'next/font/google';
import type { Metadata } from 'next';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'React Event Calendar',
    template: '%s | React Event Calendar',
  },
  description:
    'Modern event scheduling and calendar management solution with advanced features',
  keywords: [
    'React Calendar',
    'Event Scheduling',
    'Calendar App',
    'Open Source Calendar',
    'Next.js Calendar',
  ],
  authors: [
    {
      name: 'Your Name/Team',
      url: 'https://shadcn-event-calendar.vercel.app/',
    },
  ],
  openGraph: {
    title: 'React Event Calendar',
    description: 'Modern event scheduling solution with advanced features',
    url: 'https://shadcn-event-calendar.vercel.app/',
    siteName: 'React Event Calendar',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React Event Calendar',
    description: 'Modern event scheduling solution with advanced features',
    images: ['/twitter-image.png'],
  },
  metadataBase: new URL('https://shadcn-event-calendar.vercel.app/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={` ${jakarta.variable} font-jakarta antialiased`}>
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

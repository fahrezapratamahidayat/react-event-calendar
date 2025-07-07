import { DocsProvider } from '@/components/docs/docs-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'React Event Calendar Documentation',
    template: '%s | Event Calendar Docs',
  },
  description:
    'Official documentation for React Event Calendar component. Learn implementation, customization, and best practices.',
  keywords: [
    'react calendar',
    'event scheduling',
    'documentation',
    'tutorial',
    'API reference',
  ],
  openGraph: {
    title: 'React Event Calendar Documentation',
    description:
      'Complete guide for implementing and customizing React Event Calendar',
    type: 'website',
    locale: 'en_US',
    url: 'https://shadcn-event-calendar.vercel.app/docs',
    siteName: 'React Event Calendar',
    images: [
      {
        url: 'https://shadcn-event-calendar.vercel.app/og-docs.jpg',
        width: 1200,
        height: 630,
        alt: 'Documentation Overview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React Event Calendar Documentation',
    description:
      'Learn how to implement powerful calendar features in your React app',
    creator: '@shadcn',
    images: ['https://shadcn-event-calendar.vercel.app/og-docs.jpg'],
  },
  alternates: {
    canonical: 'https://shadcn-event-calendar.vercel.app/docs',
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsProvider>{children}</DocsProvider>;
}

'use client';
import { DocsProvider } from '@/components/docs/docs-provider';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsProvider>{children}</DocsProvider>;
}

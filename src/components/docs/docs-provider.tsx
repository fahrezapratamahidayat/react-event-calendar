'use client';

import { TableOfContentsMinimal } from '@/components/docs/table-of-contents';
import { DocSidebar } from '@/components/docs/doc-sidebar';
import Navbar from '../navbar';
import { DocsFooter } from './docs-footer';

export function DocsProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto">
        <div className="flex">
          <div className="hidden w-64 shrink-0 border-r md:block">
            <div className="sticky top-16 h-[calc(100vh-4rem)]">
              <DocSidebar />
            </div>
          </div>
          <main className="flex-1">
            <div className="mx-auto w-full px-4 py-10">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_220px]">
                <div className="min-w-0">
                  <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-6 text-neutral-800 dark:text-neutral-300">
                    {children}
                    <DocsFooter />
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="sticky top-24">
                    <TableOfContentsMinimal />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

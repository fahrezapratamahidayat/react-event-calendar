'use client';

import { Button } from '@/components/ui/button';
import { docsConfig } from '@/configs/docs';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export function DocsFooter() {
  const router = useRouter();
  const pathname = usePathname();

  const allNavItems = docsConfig.sidebarNav.flatMap((section) => section.items);

  const currentPageIndex = allNavItems.findIndex(
    (item) => item.href === pathname,
  );

  const goToNextPage = () => {
    if (currentPageIndex < allNavItems.length - 1) {
      router.push(allNavItems[currentPageIndex + 1].href);
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      router.push(allNavItems[currentPageIndex - 1].href);
    }
  };

  if (currentPageIndex === -1) return null;

  return (
    <div className="mt-8 w-full space-y-4">
      <div className="flex items-center justify-between">
        {currentPageIndex > 0 && (
          <Button
            onClick={goToPrevPage}
            variant="outline"
            className="items-center justify-center rounded-[6px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {allNavItems[currentPageIndex - 1].title}
          </Button>
        )}

        {currentPageIndex < allNavItems.length - 1 && (
          <Button
            onClick={goToNextPage}
            variant="outline"
            className="ml-auto items-center justify-center rounded-[6px]"
          >
            {allNavItems[currentPageIndex + 1].title}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

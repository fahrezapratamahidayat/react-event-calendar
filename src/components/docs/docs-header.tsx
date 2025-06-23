'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DocsConfig } from '@/configs/docs';

interface DocsHeaderProps {
  title: string;
  description: string;
  currentPath: string;
  config: DocsConfig;
}

export function DocsHeader({
  title,
  description,
  currentPath,
  config,
}: DocsHeaderProps) {
  const router = useRouter();
  const allNavItems = config.sidebarNav.flatMap((section) => section.items);
  const currentPageIndex = allNavItems.findIndex(
    (item) => item.href === currentPath,
  );

  if (currentPageIndex === -1) return null;

  const hasPrevPage = currentPageIndex > 0;
  const hasNextPage = currentPageIndex < allNavItems.length - 1;

  const goToNextPage = () => {
    if (hasNextPage) {
      router.push(allNavItems[currentPageIndex + 1].href);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      router.push(allNavItems[currentPageIndex - 1].href);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1
            id="overview"
            className="scroll-m-20 text-4xl font-bold tracking-tight"
          >
            {title}
          </h1>
        </div>
        <div className="flex">
          {hasPrevPage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevPage}
              className="rounded-[6px]"
              aria-label="Previous page"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {hasNextPage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextPage}
              className="rounded-[6px]"
              aria-label="Next page"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <p className="text-muted-foreground text-xl leading-7">{description}</p>
    </div>
  );
}

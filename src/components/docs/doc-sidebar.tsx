'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { docsConfig } from '@/configs/docs';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

export function DocSidebar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Set active section based on current path
    const section = docsConfig.sidebarNav.find((section) =>
      section.items.some((item) => item.href === pathname),
    );

    if (section) {
      setActiveSection(section.title);
    }
  }, [pathname]);

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="py-6 pr-6">
        {docsConfig.sidebarNav.map((section) => (
          <div key={section.title} className="mb-6">
            <button
              className="mb-2 flex cursor-pointer items-center justify-between"
              onClick={() =>
                setActiveSection(
                  activeSection === section.title ? null : section.title,
                )
              }
            >
              <h4 className="text-sm font-medium">{section.title}</h4>
              <ChevronRight
                className={cn(
                  'text-muted-foreground h-4 w-4 transition-transform',
                  activeSection === section.title && 'rotate-90',
                )}
              />
            </button>
            {activeSection === section.title && (
              <div className="grid grid-flow-row auto-rows-max text-sm">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex w-full items-center rounded-[6px] p-2 hover:underline',
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground',
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

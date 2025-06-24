'use client';

import * as React from 'react';
import { useToc } from '@/hooks/use-toc';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface TableOfContentsProps {
  className?: string;
  title?: string;
  showLevels?: number[];
  maxItems?: number;
}

export function TableOfContents({
  className,
  title = 'On This Page',
  showLevels = [2, 3, 4],
  maxItems,
}: TableOfContentsProps) {
  const { toc, activeId, scrollToHeading } = useToc();

  const filteredToc = React.useMemo(() => {
    let filtered = toc.filter((item) => showLevels.includes(item.level));

    if (maxItems && filtered.length > maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [toc, showLevels, maxItems]);

  if (filteredToc.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToHeading(id);

    history.replaceState(null, '', `#${id}`);
  };

  const getIndentationClass = (level: number) => {
    const minLevel = Math.min(...showLevels);
    const indentLevel = level - minLevel;

    switch (indentLevel) {
      case 0:
        return '';
      case 1:
        return 'ml-4';
      case 2:
        return 'ml-8';
      case 3:
        return 'ml-12';
      default:
        return `ml-${Math.min(indentLevel * 4, 16)}`;
    }
  };

  return (
    <nav className={cn('space-y-2', className)} aria-label="Table of contents">
      <div className="flex items-center gap-2">
        <p className="text-foreground text-sm font-semibold">{title}</p>
        <div className="bg-border h-px flex-1" />
      </div>

      <div className="space-y-1">
        {filteredToc.map((item) => {
          const isActive = activeId === item.id;
          const indentClass = getIndentationClass(item.level);

          return (
            <div key={item.id} className="relative">
              {isActive && (
                <div className="bg-primary absolute top-0 bottom-0 left-0 w-0.5 rounded-full" />
              )}

              <Link
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  'group hover:bg-accent/50 flex items-start gap-2 rounded-md px-2 py-1.5 text-sm transition-all duration-200',
                  indentClass,
                  isActive
                    ? 'text-primary bg-primary/5 border-primary border-l-2 pl-3 font-medium'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-current={isActive ? 'location' : undefined}
              >
                <ChevronRight
                  className={cn(
                    'mt-0.5 h-3 w-3 flex-shrink-0 transition-transform duration-200',
                    isActive
                      ? 'text-primary rotate-90'
                      : 'opacity-0 group-hover:opacity-50',
                  )}
                />

                <span className="leading-tight break-words">{item.text}</span>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="border-border/50 border-t pt-2">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>Progress</span>
          <span>
            {Math.round(
              ((filteredToc.findIndex((item) => item.id === activeId) + 1) /
                filteredToc.length) *
                100,
            ) || 0}
            %
          </span>
        </div>
        <div className="bg-secondary mt-1 h-1 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${Math.round(((filteredToc.findIndex((item) => item.id === activeId) + 1) / filteredToc.length) * 100) || 0}%`,
            }}
          />
        </div>
      </div>
    </nav>
  );
}

export function TableOfContentsMinimal() {
  const { toc, activeId, scrollToHeading } = useToc();

  if (toc.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToHeading(id);
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="space-y-1">
      <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide">
        Table Of Contents
      </p>
      {toc.map((item) => (
        <Link
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => handleClick(e, item.id)}
          className={cn(
            'block border-l-2 py-1 pl-3 text-sm transition-colors',
            item.level === 2 ? '' : 'ml-4 text-xs',
            activeId === item.id
              ? 'border-primary text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground hover:border-border border-transparent',
          )}
        >
          {item.text}
        </Link>
      ))}
    </div>
  );
}

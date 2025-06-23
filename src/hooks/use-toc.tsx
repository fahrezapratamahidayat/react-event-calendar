'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

interface TocItem {
  id: string;
  level: number;
  text: string;
}

export function useToc() {
  const [toc, setToc] = React.useState<TocItem[]>([]);
  const [activeId, setActiveId] = React.useState<string>('');
  const pathname = usePathname();

  const buildToc = React.useCallback(() => {
    const headings = Array.from(
      document.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]'),
    ) as HTMLElement[];

    const headingsData: TocItem[] = headings.map((heading) => ({
      id: heading.id,
      level: Number(heading.tagName.substring(1)),
      text: heading.textContent?.trim() || '',
    }));

    setToc(headingsData);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      buildToc();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, buildToc]);

  React.useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev,
          );

          setActiveId(mostVisible.target.id);
        } else {
          // If no entries are intersecting, find the closest one above viewport
          const headingElements = toc
            .map((item) => document.getElementById(item.id))
            .filter(Boolean);
          const aboveViewport = headingElements.filter((el) => {
            const rect = el!.getBoundingClientRect();
            return rect.top < 0;
          });

          if (aboveViewport.length > 0) {
            // Get the last heading above viewport
            const closest = aboveViewport[aboveViewport.length - 1];
            setActiveId(closest!.id);
          }
        }
      },
      {
        rootMargin: '-20% 0% -35% 0%', // Trigger when heading is in the middle portion of viewport
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    // Observe all headings
    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [toc]);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      buildToc();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [buildToc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 20;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return {
    toc,
    activeId,
    scrollToHeading,
    refreshToc: buildToc,
  };
}

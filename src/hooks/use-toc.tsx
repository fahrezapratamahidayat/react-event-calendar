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

  // Function to build TOC from DOM
  const buildToc = React.useCallback(() => {
    const headings = Array.from(
      document.querySelectorAll(
        'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]',
      ),
    ) as HTMLElement[];

    const headingsData: TocItem[] = headings.map((heading) => ({
      id: heading.id,
      level: Number(heading.tagName.substring(1)),
      text: heading.textContent?.trim() || '',
    }));

    setToc(headingsData);
  }, []);

  // Build TOC on mount and pathname change
  React.useEffect(() => {
    // Small delay to ensure DOM is ready after route change
    const timer = setTimeout(() => {
      buildToc();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, buildToc]);

  // Intersection Observer for active section detection
  React.useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that's most in view
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          // Sort by intersection ratio and choose the most visible one
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

  // Listen for content changes (useful for dynamic content)
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

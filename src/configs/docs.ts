export type DocsConfig = {
  sidebarNav: {
    title: string;
    items: {
      href: string;
      title: string;
    }[];
  }[];
};

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: 'Introduction',
      items: [
        { href: '/docs', title: 'React Event Calendar' },
        { href: '/docs/installation', title: 'Installation' },
        { href: '/docs/architecture', title: 'Architecture' },
      ],
    },
    {
      title: 'Hooks',
      items: [
        { href: '/docs/hooks/use-events', title: 'useEvents' },
        { href: '/docs/hooks/use-calendar', title: 'useCalendar' },
      ],
    },
    {
      title: 'Database',
      items: [
        { href: '/docs/db/schema', title: 'Schema' },
        { href: '/docs/db/migrations', title: 'Migrations' },
        { href: '/docs/db/queries', title: 'Queries' },
      ],
    },
    {
      title: 'API',
      items: [
        { href: '/docs/api/events', title: 'Events API' },
        { href: '/docs/api/categories', title: 'Categories API' },
      ],
    },
    {
      title: 'Customization',
      items: [
        { href: '/docs/customization/theming', title: 'Theming' },
        { href: '/docs/customization/localization', title: 'Localization' },
      ],
    },
  ],
};

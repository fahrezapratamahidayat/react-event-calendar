export type DocsConfig = {
  mainNav: {
    title: string;
    href: string;
  }[];
  sidebarNav: {
    title: string;
    items: {
      href: string;
      title: string;
      description?: string;
    }[];
  }[];
  projectInfo: {
    name: string;
    description: string;
    version: string;
    features: string[];
    techStack: string[];
    github?: string;
  };
};

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Documentation',
      href: '/docs',
    },
    {
      title: 'Demo',
      href: '/demo',
    },
  ],
  sidebarNav: [
    {
      title: 'Introduction',
      items: [
        {
          href: '/docs',
          title: 'React Event Calendar',
          description:
            'Modern event calendar built with React, Next.js and Tailwind CSS',
        },
        {
          href: '/docs/installation',
          title: 'Installation',
          description:
            'How to install and get started with React Event Calendar',
        },
        {
          href: '/docs/architecture',
          title: 'Architecture',
          description: 'Understanding the application structure and workflow',
        },
      ],
    },
    {
      title: 'Core Features',
      items: [
        {
          href: '/docs/features/calendar-views',
          title: 'Calendar Views',
          description: 'Day, week, month and agenda views',
        },
        {
          href: '/docs/features/event-management',
          title: 'Event Management',
          description: 'Create, edit and delete events easily',
        },
      ],
    },
    {
      title: 'Hooks',
      items: [
        {
          href: '/docs/hooks/use-events',
          title: 'useEvents',
          description: 'Hook for managing event data',
        },
      ],
    },
    {
      title: 'Database',
      items: [
        {
          href: '/docs/db/schema',
          title: 'Schema',
          description: 'Database structure for storing events and categories',
        },
        {
          href: '/docs/db/migrations',
          title: 'Migrations',
          description: 'Managing database schema changes',
        },
        {
          href: '/docs/db/queries',
          title: 'Queries',
          description: 'Optimized queries for high performance',
        },
      ],
    },
    {
      title: 'Customization',
      items: [
        {
          href: '/docs/customization/theming',
          title: 'Theming',
          description: 'Customize appearance with shadcn/ui and Tailwind CSS',
        },
        {
          href: '/docs/customization/localization',
          title: 'Localization',
          description: 'Multi-language support and local date formats',
        },
      ],
    },
  ],
  projectInfo: {
    name: 'React Event Calendar',
    description:
      'Modern event calendar solution built with React, Next.js, shadcn/ui, Tailwind CSS v4, and Framer Motion. Designed to deliver a seamless user experience with high performance and easy customization.',
    version: '1.0.0',
    features: [
      'Responsive calendar views (day, week, month, agenda)',
      'Customizable themes with shadcn/ui and Tailwind CSS v4',
      'Efficient state management with nuqs',
      'Reliable date manipulation with date-fns',
      'High performance with Next.js App Router',
      'Comprehensive API for custom integrations',
      'Complete documentation and implementation examples',
    ],
    techStack: [
      'React 18+',
      'Next.js 15+',
      'Tailwind CSS v4',
      'shadcn/ui',
      'Framer Motion',
      'date-fns',
      'nuqs',
      'TypeScript',
    ],
    github: 'https://github.com/fahrezapratamahidayat/react-event-calendar',
  },
};

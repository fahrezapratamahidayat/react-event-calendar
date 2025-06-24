'use client';

import React from 'react';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { DocsHeader } from '@/components/docs/docs-header';
import { docsConfig } from '@/configs/docs';

export default function ThemingDocsPage() {
  return (
    <div className="space-y-16">
      <DocsHeader
        title={'Theming'}
        description={`Customize the appearance of React Event Calendar using Tailwind CSS.`}
        currentPath="/docs/customization/theming"
        config={docsConfig}
      />

      <div className="space-y-12">
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="overview"
          >
            Overview
          </h2>
          <p className="mb-4 leading-7">
            React Event Calendar is built with Tailwind CSS, making it highly
            customizable. You can modify colors, spacing, typography, and more
            to match your application&apos;s design system.
          </p>

          <Callout variant="info" className="my-6">
            <p>
              For advanced theming options and inspiration, we recommend
              visiting{' '}
              <a
                href="https://tweakcn.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                TweakCN
              </a>
              , which provides excellent resources for Tailwind CSS and
              shadcn/ui customization.
            </p>
          </Callout>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="css-variables"
          >
            CSS Variables
          </h2>
          <p className="mb-4 leading-7">
            The calendar uses CSS variables for theming, which are defined in
            your{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              globals.css
            </code>{' '}
            file. Modify these variables to change the overall color scheme.
          </p>

          <CodeBlock
            language="css"
            filename="src/styles/globals.css"
            code={`:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.19 0.01 248.51);
  --card: oklch(0.98 0 197.14);
  --card-foreground: oklch(0.19 0.01 248.51);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.19 0.01 248.51);
  --primary: oklch(0.67 0.16 245);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.19 0.01 248.51);
  --secondary-foreground: oklch(1 0 0);
  --muted: oklch(0.92 0 286.37);
  --muted-foreground: oklch(0.19 0.01 248.51);
  --accent: oklch(0.94 0.02 250.85);
  --accent-foreground: oklch(0.67 0.16 245);
  --destructive: oklch(0.62 0.24 25.77);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.93 0.01 231.66);
  --input: oklch(0.98 0 228.78);
  --ring: oklch(0.68 0.16 243.35);
  --radius: 1.3rem;
}

.dark {
  --background: oklch(0 0 0);
  --foreground: oklch(0.93 0 228.79);
  --card: oklch(0.21 0.01 274.53);
  --card-foreground: oklch(0.89 0 0);
  --popover: oklch(0 0 0);
  --popover-foreground: oklch(0.93 0 228.79);
  --primary: oklch(0.67 0.16 245.01);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.96 0 219.53);
  --secondary-foreground: oklch(0.19 0.01 248.51);
  --muted: oklch(0.21 0 0);
  --muted-foreground: oklch(0.56 0.01 247.97);
  --accent: oklch(0.19 0.03 242.55);
  --accent-foreground: oklch(0.67 0.16 245.01);
  --destructive: oklch(0.62 0.24 25.77);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.27 0 248);
  --input: oklch(0.3 0.03 244.82);
  --ring: oklch(0.68 0.16 243.35);
}`}
          />

          <p className="mt-6 leading-7">
            Notice how we&apos;re using the modern OKLCH color space instead of
            HSL. This provides better color consistency and perceptual
            uniformity across different hues.
          </p>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="event-colors"
          >
            Event Color Customization
          </h2>
          <p className="mb-4 leading-7">
            Customizing event colors requires changes in{' '}
            <strong>two places</strong>:
          </p>

          <h3 className="mb-3 text-xl font-semibold">1. Calendar Constants</h3>
          <p className="mb-4 leading-7">
            First, define the color options in the calendar constants file:
          </p>

          <CodeBlock
            language="tsx"
            filename="constants/calendar-constant.ts"
            code={`export const EVENT_COLORS = [
  { label: 'Blue', value: 'oklch(0.55 0.20 240)' },
  { label: 'Green', value: 'oklch(0.60 0.18 140)' },
  { label: 'Red', value: 'oklch(0.60 0.22 20)' },
  { label: 'Purple', value: 'oklch(0.65 0.25 320)' },
  { label: 'Orange', value: 'oklch(0.70 0.18 60)' },
  { label: 'Pink', value: 'oklch(0.70 0.20 340)' },
  { label: 'Indigo', value: 'oklch(0.55 0.18 270)' },
  { label: 'Teal', value: 'oklch(0.60 0.15 180)' },
  { label: 'Cyan', value: 'oklch(0.65 0.18 200)' },
  { label: 'Emerald', value: 'oklch(0.65 0.16 160)' },
  // Add your custom colors here
];`}
          />

          <h3 className="mt-6 mb-3 text-xl font-semibold">
            2. Color Classes Definition
          </h3>
          <p className="mb-4 leading-7">
            <strong>Important:</strong> You must also define the corresponding
            Tailwind classes for each color in the COLOR_CLASSES object:
          </p>

          <CodeBlock
            language="tsx"
            filename="lib/event.ts"
            code={`/**
 * Color theme definitions for calendar events
 * @type {Record<string, { bg: string; border: string; text: string; badge: { bg: string; text: string } }>}
 */
export const COLOR_CLASSES = {
  blue: {
    bg: 'bg-blue-700 hover:bg-blue-800',
    border: 'border-blue-800 hover:border-blue-700',
    text: 'text-blue-800 hover:text-blue-700',
    badge: {
      bg: 'bg-blue-700 dark:bg-blue-900/20',
      text: 'text-blue-800 dark:text-blue-200',
    },
  },
  red: {
    bg: 'bg-red-700 hover:bg-red-800',
    border: 'border-red-800 hover:border-red-700',
    text: 'text-red-800 hover:text-red-700',
    badge: {
      bg: 'bg-red-700 dark:bg-red-900/20',
      text: 'text-red-800 dark:text-red-200',
    },
  },
  // ... other existing colors

  // When adding a new color to EVENT_COLORS, add it here too
  emerald: {
    bg: 'bg-emerald-700 hover:bg-emerald-800',
    border: 'border-emerald-800 hover:border-emerald-700',
    text: 'text-emerald-800 hover:text-emerald-700',
    badge: {
      bg: 'bg-emerald-700 dark:bg-emerald-900/20',
      text: 'text-emerald-800 dark:text-emerald-200',
    },
  },
  // Add your custom colors here
} satisfies Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    badge: {
      bg: string;
      text: string;
    };
  }
>;

export type ColorName = keyof typeof COLOR_CLASSES;

/**
 * Gets color classes for a given color name
 * @param {string} color - Color name (e.g., 'blue', 'red')
 * @returns {Object} Color classes for the specified color
 */
export const getColorClasses = (color: string) =>
  COLOR_CLASSES[color as ColorName] || COLOR_CLASSES.blue;`}
          />

          <Callout variant="warning" className="my-6">
            <p>
              <strong>Important:</strong> When adding new colors to
              EVENT_COLORS, you must also add corresponding entries to
              COLOR_CLASSES. The calendar components use these class definitions
              to style events, and they cannot use string color values directly.
            </p>
          </Callout>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="adding-custom-colors"
          >
            Adding Custom Colors
          </h2>
          <p className="mb-4 leading-7">
            To add a new custom color to your calendar events, follow these
            steps:
          </p>

          <ol className="my-6 ml-6 list-decimal [&>li]:mt-3">
            <li className="leading-7">
              <strong>Add the color to EVENT_COLORS</strong> in
              calendar-constant.ts
            </li>
            <li className="leading-7">
              <strong>Define the Tailwind classes</strong> for the color in
              COLOR_CLASSES in event.ts
            </li>
            <li className="leading-7">
              <strong>Make sure the color key matches</strong> between both
              definitions
            </li>
          </ol>

          <p className="mb-4 leading-7">
            Example of adding a new &quot;Violet&quot; color:
          </p>

          <CodeBlock
            language="tsx"
            filename="constants/calendar-constant.ts"
            code={`export const EVENT_COLORS = [
  // ... existing colors
  { label: 'Violet', value: 'oklch(0.60 0.24 300)' },
];`}
          />

          <p className="mt-4 mb-4 leading-7">And then in COLOR_CLASSES:</p>

          <CodeBlock
            language="tsx"
            filename="lib/event.ts"
            code={`export const COLOR_CLASSES = {
  // ... existing colors
  violet: {
    bg: 'bg-violet-700 hover:bg-violet-800',
    border: 'border-violet-800 hover:border-violet-700',
    text: 'text-violet-800 hover:text-violet-700',
    badge: {
      bg: 'bg-violet-700 dark:bg-violet-900/20',
      text: 'text-violet-800 dark:text-violet-200',
    },
  },
};`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="component-customization"
          >
            Component Customization
          </h2>
          <p className="mb-4 leading-7">
            React Event Calendar components can be customized using the design
            tokens defined in your theme configuration. The components
            automatically pick up changes to your CSS variables.
          </p>

          <h3 className="mb-3 text-xl font-semibold">
            Calendar Navigate Components
          </h3>
          <p className="mb-4 leading-7">
            Customize the Calendar Navigate components by modifying the
            component styles:
          </p>

          <CodeBlock
            language="tsx"
            code={`<div className="flex w-full items-center justify-around sm:hidden">
  <Button
    variant="outline"
    className="hover:bg-muted rounded-full"
    onClick={handleNavigatePrevious}
  >
    <ChevronLeft className="h-4 w-4" />
    Previous
  </Button>
  <Button
    variant={'outline'}
    className="hover:bg-muted rounded-full"
    onClick={handleNavigateNext}
  >
    <ChevronRight className="h-4 w-4" />
    Next
  </Button>
</div>`}
          />

          <h3 className="mt-6 mb-3 text-xl font-semibold">Event Card</h3>
          <p className="mb-4 leading-7">
            Event Card use the color classes defined in COLOR_CLASSES:
          </p>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/ui/event.tsx"
            code={` const { bg, badge } = getColorClasses(event.color);
  return (
    <Button
      key={event.id}
      className={cn(
        'group/event relative z-0 flex h-auto w-full flex-col items-start justify-start gap-3 px-4 py-3 text-left text-white hover:cursor-pointer',
        'transition-all duration-200',
        'focus-visible:ring-ring last:border-b-0 focus-visible:ring-1 focus-visible:ring-offset-0',
        bg,
      )}
      onClick={() => onClick(event)}
    >`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="theme-switcher"
          >
            Theme Switcher
          </h2>
          <p className="mb-4 leading-7">
            Create a comprehensive theme switcher that supports multiple custom
            themes:
          </p>

          <CodeBlock
            language="tsx"
            filename="components/theme-switcher.tsx"
            code={`'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Laptop } from 'lucide-react';

const themes = [
  { name: 'Light', value: 'light', icon: Sun },
  { name: 'Dark', value: 'dark', icon: Moon },
  { name: 'System', value: 'system', icon: Laptop },
];

const customThemes = [
  { name: 'Purple', value: 'theme-purple', color: 'oklch(0.65 0.25 320)' },
  { name: 'Ocean', value: 'theme-ocean', color: 'oklch(0.55 0.20 220)' },
];

export function ThemeSwitcher() {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark', ...customThemes.map(t => t.value));

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => {
          const Icon = t.icon;
          return (
            <DropdownMenuItem
              key={t.value}
              onClick={() => setTheme(t.value)}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{t.name}</span>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        {customThemes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
          >
            <div className="mr-2 h-4 w-4 rounded-full" style={{ backgroundColor: t.color }} />
            <span>{t.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`}
          />
        </section>
      </div>
    </div>
  );
}

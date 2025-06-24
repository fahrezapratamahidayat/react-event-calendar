'use client';

import React from 'react';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { DocsHeader } from '@/components/docs/docs-header';
import { docsConfig } from '@/configs/docs';

export default function LocalizationDocsPage() {
  return (
    <div className="space-y-16">
      <DocsHeader
        title={'Localization'}
        description={`Customize language and date formats in React Event Calendar.`}
        currentPath="/docs/customization/localization"
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
            React Event Calendar supports various languages and date formats
            through Day.js integration. You can change the calendar language,
            date formats, and day/month names to match your application&apos;s
            requirements.
          </p>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="supported-languages"
          >
            Supported Languages
          </h2>
          <p className="mb-4 leading-7">
            React Event Calendar supports the following languages by default:
          </p>

          <CodeBlock
            language="tsx"
            filename="constants/calendar-constant.ts"
            code={`export const LOCALES = [
  { value: 'en-US', label: 'English (US)', locale: enUS },
  { value: 'en-GB', label: 'English (UK)', locale: enGB },
  { value: 'id-ID', label: 'Bahasa Indonesia', locale: id },
  { value: 'es-ES', label: 'Español', locale: es },
  { value: 'fr-FR', label: 'Français', locale: fr },
  { value: 'de-DE', label: 'Deutsch', locale: de },
  { value: 'ja-JP', label: '日本語', locale: ja },
  { value: 'ko-KR', label: '한국어', locale: ko },
] as const;
export type LocaleCode = (typeof LOCALES)[number]['value'];`}
          />

          <p className="mt-6 leading-7">
            Each entry in the{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              LOCALES
            </code>{' '}
            array contains:
          </p>
          <ul className="my-4 list-disc space-y-2 pl-6">
            <li>
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                value
              </code>
              : Language code in BCP 47 format (like &apos;en-US&apos;)
            </li>
            <li>
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                label
              </code>
              : Language name displayed in the UI
            </li>
            <li>
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                locale
              </code>
              : Day.js locale object containing date format configurations and
              translations
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="changing-language"
          >
            Changing Calendar Language
          </h2>
          <p className="mb-4 leading-7">
            Users can change the calendar language through the calendar settings
            dialog:
          </p>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/calendar-setting-dialog.tsx"
            code={`<Select value={locale} onValueChange={setLocale}>
  <SelectTrigger className="w-40">
    <SelectValue placeholder="Select language" />
  </SelectTrigger>
  <SelectContent>
    {LOCALES.map((loc) => (
      <SelectItem key={loc.value} value={loc.value}>
        {loc.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>`}
          />

          <p className="mt-6 leading-7">
            When the language is changed, the calendar will use the appropriate
            locale object to format dates and day/month names:
          </p>

          <CodeBlock
            language="tsx"
            filename="components/event-calendar/calendar-setting-dialog.tsx"
            code={`const localeObj = getLocaleFromCode(locale);
const localizedDays = getLocalizedDaysOfWeek(localeObj);`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="adding-languages"
          >
            Adding New Languages
          </h2>
          <p className="mb-4 leading-7">
            To add a new language to the calendar, follow these steps:
          </p>

          <h3 className="mt-6 mb-3 text-xl font-semibold">
            1. Import Day.js Locale
          </h3>
          <p className="mb-4 leading-7">
            First, import the desired Day.js locale in the{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              constants/calendar-constant.ts
            </code>{' '}
            file:
          </p>

          <CodeBlock
            language="tsx"
            filename="constants/calendar-constant.ts"
            code={`import { enUS, enGB, id, es, fr, de, ja, ko, zh } from 'date-fns/locale';
// Add new locale imports here, for example:
// import { it } from 'date-fns/locale';`}
          />

          <h3 className="mt-6 mb-3 text-xl font-semibold">
            2. Add to LOCALES Array
          </h3>
          <p className="mb-4 leading-7">
            Then, add a new entry to the{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              LOCALES
            </code>{' '}
            array:
          </p>

          <CodeBlock
            language="tsx"
            filename="constants/calendar-constant.ts"
            code={`export const LOCALES = [
  { value: 'en-US', label: 'English (US)', locale: enUS },
  { value: 'en-GB', label: 'English (UK)', locale: enGB },
  { value: 'id-ID', label: 'Bahasa Indonesia', locale: id },
  // ... other languages

  // Add new languages here
  { value: 'zh-CN', label: '中文', locale: zh },
  // { value: 'it-IT', label: 'Italiano', locale: it },
] as const;`}
          />

          <Callout variant="info" className="my-6">
            <p>
              <strong>Note:</strong> Make sure the language code follows the BCP
              47 format (like &apos;en-US&apos;, &apos;id-ID&apos;) and the
              label uses the language name in its native form.
            </p>
          </Callout>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="custom-formatting"
          >
            Custom Date Formatting
          </h2>
          <p className="mb-4 leading-7">
            You can customize date formats by modifying the formatting functions
            in your application:
          </p>

          <CodeBlock
            language="tsx"
            filename="lib/event.ts"
            code={`/**
 * Retrieves a localization object based on the provided language code.
 *
 * @param code - A language code in BCP 47 format (e.g., 'en-US').
 * @returns The corresponding Day.js locale object, or falls back to English (US) if not found.
 */
export const getLocaleFromCode = (code: string) => {
  return LOCALES.find((l) => l.value === code)?.locale || enUS;
};

/**
 * Gets localized days of the week.
 *
 * @param locale - Day.js locale object.
 * @returns Array of localized day names.
 */
export const getLocalizedDaysOfWeek = (locale: Locale) => {
  // Custom implementation for day name formatting
  // ...
};`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="best-practices"
          >
            Localization Best Practices
          </h2>
          <p className="mb-4 leading-7">
            Here are some best practices when implementing localization in your
            application:
          </p>

          <ul className="my-4 list-disc space-y-2 pl-6">
            <li>
              Always use the{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                getLocaleFromCode
              </code>{' '}
              function to get the correct locale object
            </li>
            <li>Avoid hardcoding strings related to dates and times</li>
            <li>
              Test your application with various languages to ensure layout and
              display remain consistent
            </li>
            <li>
              Consider text direction (RTL/LTR) for languages like Arabic or
              Hebrew
            </li>
            <li>
              Store user language preferences in local storage for a consistent
              experience
            </li>
          </ul>

          <Callout variant="warning" className="my-6">
            <p>
              <strong>Important:</strong> When adding new languages, ensure all
              UI components displaying date and time-related text use the
              appropriate localization functions. Don&apos;t rely on hardcoded
              strings.
            </p>
          </Callout>
        </section>
      </div>
    </div>
  );
}

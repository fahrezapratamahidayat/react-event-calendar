import React from 'react';
import { CodeBlock } from '@/components/docs/code-block';
import FileTree from '@/components/docs/file-tree';
import { PackageManager } from '@/components/docs/package-manager';
import { DocsHeader } from '@/components/docs/docs-header';
import { docsConfig } from '@/configs/docs';

export default function InstallationPage() {
  return (
    <div className="space-y-16">
      <DocsHeader
        title={'Installation'}
        description={
          '     Step-by-step guide to install React Event Calendar in your project.'
        }
        currentPath="/docs/installation"
        config={docsConfig}
      />

      <div className="space-y-12">
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="prerequisites"
          >
            Prerequisites
          </h2>
          <p className="mb-4 leading-7">
            Before you begin, make sure you have:
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-3">
            <li>Node.js 18.0.0 or newer</li>
            <li>npm, yarn, pnpm, or bun as your package manager</li>
            <li>Git for cloning the repository</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="install-nextjs"
          >
            Install Next.js
          </h2>
          <p className="mb-4 leading-7">
            Create a new Next.js project with App Router:
          </p>
          <PackageManager
            name="create-next-app@latest my-calendar-app"
            isExecuteCommand={true}
          />
          <p className="mt-4 leading-7">
            Select the following configuration when prompted:
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>✅ TypeScript</li>
            <li>✅ ESLint</li>
            <li>✅ Tailwind CSS</li>
            <li>✅ src/ directory</li>
            <li>✅ App Router</li>
            <li>❌ Turbopack</li>
          </ul>
          <p className="leading-7">Navigate to your project directory:</p>
          <CodeBlock
            showLineNumbers={false}
            language="bash"
            code="cd my-calendar-app"
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="install-shadcn"
          >
            Install shadcn/ui
          </h2>
          <p className="mb-4 leading-7">
            Install shadcn/ui to access the UI components used in React Event
            Calendar:
          </p>
          <PackageManager name="npx shadcn-ui@latest init" />
          <p className="mt-4 leading-7">
            Choose the configuration that matches your project or use the
            defaults.
          </p>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="install-components"
          >
            Install Required shadcn/ui Components
          </h2>
          <p className="mb-4 leading-7">
            Install the required shadcn/ui components for React Event Calendar:
          </p>
          <PackageManager
            name={`shadcn-ui@latest add button dialog popover dropdown-menu form input label tooltip card`}
            isExecuteCommand={true}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="install-dependencies"
          >
            Install Required Libraries
          </h2>
          <p className="mb-4 leading-7">
            Install the required libraries for calendar functionality:
          </p>
          <PackageManager name="npm install date-fns framer-motion nuqs zod react-hook-form @hookform/resolvers" />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="clone-repository"
          >
            Clone Repository
          </h2>
          <p className="mb-4 leading-7">
            Clone the React Event Calendar repository to get the source code:
          </p>
          <CodeBlock
            showLineNumbers={false}
            language="bash"
            code="git clone https://github.com/username/react-event-calendar.git"
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="copy-files"
          >
            Copy Required Files and Folders
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-xl font-semibold">
                Copy Event Calendar Components
              </h3>
              <p className="mb-4 leading-7">
                Copy the{' '}
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  event-calendar
                </code>{' '}
                folder from{' '}
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  src/components
                </code>{' '}
                in the repository to{' '}
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  src/components
                </code>{' '}
                in your project:
              </p>
              <CodeBlock
                showLineNumbers={false}
                language="bash"
                code="cp -r react-event-calendar/src/components/event-calendar
                ./src/components/"
              />
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold">
                Copy Additional Folders
              </h3>
              <p className="mb-4 leading-7">
                Copy these folders to your{' '}
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  src
                </code>{' '}
                directory:
              </p>
              <CodeBlock
                showLineNumbers={false}
                language="bash"
                code={`# Copy types folder
cp -r react-event-calendar/src/types ./src/

# Copy lib folder
cp -r react-event-calendar/src/lib ./src/

# Copy constants folder
cp -r react-event-calendar/src/constants ./src/

# Copy db folder
cp -r react-event-calendar/src/db ./src/

# Copy hooks folder
cp -r react-event-calendar/src/hooks ./src/`}
              />
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold">Copy Actions File</h3>
              <p className="mb-4 leading-7">
                Copy the{' '}
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  actions.ts
                </code>{' '}
                file to your{' '}
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  app
                </code>{' '}
                directory:
              </p>
              <CodeBlock
                language="bash"
                showLineNumbers={false}
                code="cp react-event-calendar/src/app/actions.ts ./src/app/"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="project-structure"
          >
            Project Structure
          </h2>
          <p className="mb-6 leading-7">
            After installation, your project structure should look like this:
          </p>
          <div className="my-10">
            <FileTree
              tree={[
                {
                  'my-calendar-app': [
                    {
                      src: [
                        {
                          app: [
                            'actions.ts',
                            'globals.css',
                            'layout.tsx',
                            'page.tsx',
                          ],
                        },
                        {
                          components: [
                            {
                              'event-calendar': [
                                'calendar.tsx',
                                'calendar-day-view.tsx',
                                'calendar-header.tsx',
                                'calendar-month-view.tsx',
                                'calendar-tabs.tsx',
                                'calendar-week-view.tsx',
                                'event-form.tsx',
                                'event-item.tsx',
                              ],
                            },
                            {
                              ui: [
                                'button.tsx',
                                'dialog.tsx',
                                'popover.tsx',
                                'dropdown-menu.tsx',
                                'select.tsx',
                                'form.tsx',
                                'input.tsx',
                                'label.tsx',
                                'tooltip.tsx',
                                'tabs.tsx',
                                'card.tsx',
                              ],
                            },
                          ],
                        },
                        'types/',
                        'lib/',
                        'constants/',
                        'db/',
                        'hooks/',
                      ],
                    },
                    'package.json',
                    'tailwind.config.js',
                    'tsconfig.json',
                    'next.config.js',
                  ],
                },
              ]}
              showArrow={true}
              showIcon={true}
            />
          </div>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="usage"
          >
            Using Event Calendar Component
          </h2>
          <p className="mb-4 leading-7">
            Now you can use the Event Calendar component in your pages. Edit{' '}
            <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
              src/app/page.tsx
            </code>{' '}
            to implement the Event Calendar:
          </p>
          <CodeBlock
            filename="app.tsx"
            language="tsx"
            code={`import { EventCalendar } from '@/components/event-calendar/calendar';
import { getCategories, getEvents } from './actions';
import { SearchParams } from 'nuqs';
import { searchParamsCache } from '@/lib/searchParams';
import { CalendarViewType } from '@/types/event';
import { Suspense } from 'react';

interface DemoPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function EventCalendarPage(props: DemoPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const promises = await Promise.all([
    getEvents({
      ...search,
      date: search.date,
      view: search.view as CalendarViewType,
      daysCount: Number(search.daysCount),
    }),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Event Calendar</h1>
      <Suspense fallback={<div>Loading calendar...</div>}>
        <EventCalendar promises={promises} initialDate={search.date} />
      </Suspense>
    </div>
  );
}`}
          />
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="verify-installation"
          >
            Verify Installation
          </h2>
          <p className="mb-4 leading-7">
            Run the development server to verify your installation:
          </p>
          <CodeBlock
            showLineNumbers={false}
            language={'bash'}
            code="npm run dev"
          />
          <p className="mt-6 leading-7">
            Open{' '}
            <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
              http://localhost:3000
            </code>{' '}
            in your browser to see the application running.
          </p>
        </section>

        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="troubleshooting"
          >
            Troubleshooting
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Error: Module not found
              </h3>
              <p className="leading-7">
                If you get a &quot;Module not found&quot; error, make sure:
              </p>
              <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
                <li>All dependencies are installed correctly</li>
                <li>
                  All files and folders have been copied to the right locations
                </li>
                <li>Import paths in the code match your folder structure</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">TypeScript Errors</h3>
              <p className="leading-7">If you get TypeScript errors, ensure:</p>
              <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
                <li>Type files have been copied correctly</li>
                <li>TypeScript configuration supports path aliases (@/)</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Styling Issues</h3>
              <p className="leading-7">
                If styling doesn&apos;t appear correctly, verify:
              </p>
              <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
                <li>Tailwind CSS is configured properly</li>
                <li>shadcn/ui components are installed correctly</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

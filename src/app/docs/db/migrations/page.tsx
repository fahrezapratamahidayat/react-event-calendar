import React from 'react';
import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { DocsHeader } from '@/components/docs/docs-header';
import { docsConfig } from '@/configs/docs';

export const metadata = {
  title: 'Database Migrations Guide - React Event Calendar',
  description:
    'Step-by-step guide for managing database schema changes using Drizzle ORM migrations',
  keywords: [
    'database migrations',
    'drizzle orm',
    'schema changes',
    'postgresql',
  ],
  openGraph: {
    title: 'Database Migration Documentation',
    url: 'https://shadcn-event-calendar.vercel.app/docs/db/migrations',
  },
};

export default function MigrationsDocsPage() {
  return (
    <div className="space-y-16">
      <DocsHeader
        title={'Database Migrations'}
        description={`Managing database schema changes with Drizzle ORM migrations.`}
        currentPath="/docs/db/migrations"
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
            Database migrations are essential for evolving your schema over time
            in a controlled, versioned manner. React Event Calendar uses Drizzle
            ORM&apos;s migration system to handle schema changes safely.
          </p>
          <Callout variant="info" className="my-6">
            <p>
              Migrations allow you to track changes to your database schema,
              apply them consistently across environments, and roll back changes
              if needed.
            </p>
          </Callout>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="migration-script"
          >
            Migration Script
          </h2>
          <p className="mb-4 leading-7">
            The core migration script is defined in{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              src/db/migrate.ts
            </code>
            :
          </p>
          <CodeBlock
            language="tsx"
            filename="db/migrate.ts"
            code={`import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './index';

async function runMigrations() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigrations();`}
          />
          <p className="mt-6 leading-7">This script:</p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              Imports the migration utilities from Drizzle ORM
            </li>
            <li className="leading-7">
              Uses the database connection from{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                db/index.ts
              </code>
            </li>
            <li className="leading-7">
              Runs all pending migrations from the{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                drizzle
              </code>{' '}
              folder
            </li>
            <li className="leading-7">
              Handles success and error cases with appropriate logging
            </li>
          </ul>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="migration-workflow"
          >
            Migration Workflow
          </h2>
          <p className="mb-4 leading-7">
            The typical workflow for managing database schema changes is:
          </p>
          <ol className="my-6 ml-6 list-decimal [&>li]:mt-3">
            <li className="leading-7">
              <strong>Update schema definition</strong> - Modify your{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                schema.ts
              </code>{' '}
              file with the desired changes
            </li>
            <li className="leading-7">
              <strong>Generate migration files</strong> - Create SQL migration
              files based on schema changes
            </li>
            <li className="leading-7">
              <strong>Review migrations</strong> - Check the generated SQL to
              ensure it&apos;s correct
            </li>
            <li className="leading-7">
              <strong>Apply migrations</strong> - Run the migrations to update
              your database
            </li>
            <li className="leading-7">
              <strong>Update application code</strong> - Update your TypeScript
              code to work with the new schema
            </li>
          </ol>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="generating-migrations"
          >
            Generating Migrations
          </h2>
          <p className="mb-4 leading-7">
            To generate migration files based on your schema changes:
          </p>
          <CodeBlock
            language="bash"
            code={`# Generate SQL migration files
npx drizzle-kit generate:pg --schema=./src/db/schema.ts --out=./drizzle`}
          />
          <p className="mt-6 leading-7">This command:</p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">
              Analyzes your current{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                schema.ts
              </code>{' '}
              file
            </li>
            <li className="leading-7">
              Compares it with the previous schema version
            </li>
            <li className="leading-7">
              Generates SQL migration files in the{' '}
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
                drizzle
              </code>{' '}
              directory
            </li>
            <li className="leading-7">
              Creates a timestamp-based migration name for versioning
            </li>
          </ul>
          <p className="mt-6 leading-7">
            Example of a generated migration file:
          </p>
          <CodeBlock
            language="sql"
            filename="drizzle/0001_initial_migration.sql"
            code={`CREATE TABLE IF NOT EXISTS "events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" varchar(256) NOT NULL,
  "description" text NOT NULL,
  "start_date" timestamp with time zone NOT NULL,
  "end_date" timestamp with time zone NOT NULL,
  "start_time" varchar(5) NOT NULL,
  "end_time" varchar(5) NOT NULL,
  "is_repeating" boolean NOT NULL,
  "repeating_type" varchar(10),
  "location" varchar(256) NOT NULL,
  "category" varchar(100) NOT NULL,
  "color" varchar(15) NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);`}
          />
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="applying-migrations"
          >
            Applying Migrations
          </h2>
          <p className="mb-4 leading-7">
            There are two ways to apply migrations to your database:
          </p>
          <h3 className="mb-3 text-xl font-semibold">
            1. Using the Migration Script
          </h3>
          <p className="mb-4 leading-7">Run the migration script directly:</p>
          <CodeBlock
            language="bash"
            code={`# Run migrations using the script
npx tsx src/db/migrate.ts`}
          />
          <h3 className="mt-6 mb-3 text-xl font-semibold">
            2. Using Drizzle Kit
          </h3>
          <p className="mb-4 leading-7">
            Use the Drizzle Kit CLI to push migrations:
          </p>
          <CodeBlock
            language="bash"
            code={`# Apply migrations using Drizzle Kit
npx drizzle-kit push:pg --schema=./src/db/schema.ts`}
          />
          <Callout variant="warning" className="my-6">
            <p>
              Always back up your database before applying migrations in
              production environments. Schema changes can be destructive and may
              result in data loss if not carefully planned.
            </p>
          </Callout>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="migration-examples"
          >
            Migration Examples
          </h2>
          <p className="mb-4 leading-7">
            Here are some common schema changes and how they appear in
            migrations:
          </p>
          <h3 className="mb-3 text-xl font-semibold">Adding a New Column</h3>
          <CodeBlock
            language="tsx"
            filename="db/schema.ts (updated)"
            code={`export const events = pgTable('events', {
  // ... existing columns
  priority: integer('priority').default(0).notNull(),
});`}
          />
          <p className="mt-4 mb-2 leading-7">Generated migration:</p>
          <CodeBlock
            language="sql"
            filename="drizzle/0002_add_priority.sql"
            code={`ALTER TABLE "events" ADD COLUMN "priority" integer DEFAULT 0 NOT NULL;`}
          />
          <h3 className="mt-6 mb-3 text-xl font-semibold">
            Creating a New Table
          </h3>
          <CodeBlock
            language="tsx"
            filename="db/schema.ts (updated)"
            code={`export const eventAttendees = pgTable('event_attendees', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull(),
  status: varchar('status', {
    length: 20,
    enum: ['attending', 'declined', 'tentative']
  }).$type<'attending' | 'declined' | 'tentative'>().default('tentative'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});`}
          />
          <p className="mt-4 mb-2 leading-7">Generated migration:</p>
          <CodeBlock
            language="sql"
            filename="drizzle/0003_create_attendees.sql"
            code={`CREATE TABLE IF NOT EXISTS "event_attendees" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "event_id" uuid NOT NULL,
  "name" varchar(256) NOT NULL,
  "email" varchar(256) NOT NULL,
  "status" varchar(20) DEFAULT 'tentative',
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "event_attendees_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);`}
          />
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="migration-tracking"
          >
            Migration Tracking
          </h2>
          <p className="mb-4 leading-7">
            Drizzle ORM keeps track of which migrations have been applied using
            a special table in your database called{' '}
            <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">
              __drizzle_migrations
            </code>
            .
          </p>
          <p className="mb-4 leading-7">This table stores:</p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Migration ID (based on the filename)</li>
            <li className="leading-7">Hash of the migration content</li>
            <li className="leading-7">
              Timestamp when the migration was applied
            </li>
          </ul>
          <p className="mt-6 leading-7">This tracking ensures that:</p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="leading-7">Each migration is applied only once</li>
            <li className="leading-7">
              Migrations are applied in the correct order
            </li>
            <li className="leading-7">
              The system can detect if a previously applied migration has been
              modified
            </li>
          </ul>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="best-practices"
          >
            Migration Best Practices
          </h2>
          <p className="mb-4 leading-7">
            Follow these best practices for smooth database migrations:
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-3">
            <li className="leading-7">
              <strong>Make small, incremental changes</strong> - Smaller
              migrations are easier to test and roll back if needed
            </li>
            <li className="leading-7">
              <strong>Version control your migrations</strong> - Always commit
              migration files to your repository
            </li>
            <li className="leading-7">
              <strong>Test migrations thoroughly</strong> - Test on a copy of
              production data before applying to production
            </li>
            <li className="leading-7">
              <strong>Back up your database</strong> - Always create a backup
              before applying migrations
            </li>
            <li className="leading-7">
              <strong>Plan for rollbacks</strong> - Consider how you would
              revert changes if something goes wrong
            </li>
            <li className="leading-7">
              <strong>Document schema changes</strong> - Keep a changelog of
              significant schema changes
            </li>
          </ul>
        </section>
        <section className="space-y-6">
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
            id="deployment"
          >
            Deployment Considerations
          </h2>
          <p className="mb-4 leading-7">
            When deploying to production, consider these approaches for running
            migrations:
          </p>
          <h3 className="mb-3 text-xl font-semibold">
            1. Pre-deployment Migrations
          </h3>
          <p className="mb-4 leading-7">
            Run migrations as a separate step before deploying new application
            code. This is suitable for changes that are backward compatible with
            the current application version.
          </p>
          <h3 className="mt-6 mb-3 text-xl font-semibold">
            2. Post-deployment Migrations
          </h3>
          <p className="mb-4 leading-7">
            Deploy new application code first, then run migrations. This is
            suitable for changes that require the new application code to
            function correctly.
          </p>
          <h3 className="mt-6 mb-3 text-xl font-semibold">
            3. Automated Migrations
          </h3>
          <p className="mb-4 leading-7">
            Run migrations automatically during application startup. This can be
            implemented by adding the migration code to your application&apos;s
            initialization process:
          </p>
          <CodeBlock
            language="tsx"
            filename="app/db-init.ts"
            code={`import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '@/db';

export async function initDatabase() {
  try {
    console.log('Running database migrations...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}`}
          />
        </section>
      </div>
    </div>
  );
}

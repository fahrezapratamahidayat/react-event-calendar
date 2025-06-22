'use client';

import { docsConfig } from '@/configs/docs';

export default function DocsPage() {
  const { projectInfo } = docsConfig;

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h2
          id="overview"
          className="scroll-m-20 text-4xl font-bold tracking-tight"
        >
          {projectInfo.name}
        </h2>
        <p className="text-muted-foreground text-xl leading-7">
          {projectInfo.description}
        </p>
      </div>

      <div className="space-y-4">
        <h2
          id="features"
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
        >
          Key Features
        </h2>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-3">
          {projectInfo.features.map((feature, index) => (
            <li key={index} className="text-muted-foreground leading-7">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h2
          id="tech-stack"
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
        >
          Tech Stack
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {projectInfo.techStack.map((tech, index) => (
            <div
              key={index}
              className="bg-accent text-accent-foreground rounded-md px-3 py-1.5 text-sm font-medium"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2
          id="getting-started"
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
        >
          Getting Started
        </h2>
        <p className="mt-4 leading-7">
          To start using React Event Calendar, visit the{' '}
          <a
            href="/docs/installation"
            className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
          >
            Installation
          </a>{' '}
          page for step-by-step instructions.
        </p>
      </div>

      <div className="space-y-4">
        <h2
          id="architecture"
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
        >
          Architecture
        </h2>
        <p className="mt-4 leading-7">
          React Event Calendar is built with a modern architecture using
          Next.js, Zustand, and PostgreSQL with Drizzle ORM. Learn more about
          the design patterns and component structure in the{' '}
          <a
            href="/docs/architecture"
            className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
          >
            Architecture
          </a>{' '}
          section.
        </p>
      </div>

      <div className="space-y-4">
        <h2
          id="customization"
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
        >
          Customization
        </h2>
        <p className="mt-4 leading-7">
          The calendar supports extensive customization through view
          configurations, themes, and behavior options. You can customize:
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li className="leading-7">Visual appearance and layout</li>
          <li className="leading-7">Event display and interactions</li>
          <li className="leading-7">Date range and view options</li>
          <li className="leading-7">Time formats and localization</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2
          id="examples"
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
        >
          Examples
        </h2>
        <p className="mt-4 leading-7">
          Check out these examples to see React Event Calendar in action:
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <a
            href="/examples/basic"
            className="group hover:bg-accent rounded-lg border p-6"
          >
            <h3 className="group-hover:text-accent-foreground mb-2 text-lg font-medium">
              Basic Calendar
            </h3>
            <p className="text-muted-foreground group-hover:text-accent-foreground text-sm">
              Simple implementation with basic features
            </p>
          </a>
          <a
            href="/examples/advanced"
            className="group hover:bg-accent rounded-lg border p-6"
          >
            <h3 className="group-hover:text-accent-foreground mb-2 text-lg font-medium">
              Advanced Calendar
            </h3>
            <p className="text-muted-foreground group-hover:text-accent-foreground text-sm">
              Full-featured implementation with all customizations
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

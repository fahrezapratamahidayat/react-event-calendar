'use client';

import { docsConfig } from '@/configs/docs';

export default function DocsPage() {
  const { projectInfo } = docsConfig;

  return (
    <div className="space-y-6">
      <div>
        <h1
          id="overview"
          className="scroll-m-20 text-3xl font-bold tracking-tight"
        >
          {projectInfo.name}
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {projectInfo.description}
        </p>
      </div>

      <div>
        <h2
          id="features"
          className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight"
        >
          Fitur Utama
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2">
          {projectInfo.features.map((feature, index) => (
            <li key={index} className="text-muted-foreground">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2
          id="tech-stack"
          className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight"
        >
          Tech Stack
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {projectInfo.techStack.map((tech, index) => (
            <div
              key={index}
              className="bg-accent text-accent-foreground rounded-md px-3 py-1 text-sm"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2
          id="getting-started"
          className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight"
        >
          Memulai
        </h2>
        <p className="text-muted-foreground mt-2">
          Untuk memulai menggunakan React Event Calendar, silakan kunjungi
          halaman{' '}
          <a
            href="/docs/installation"
            className="text-primary underline underline-offset-4"
          >
            Instalasi
          </a>
          .
        </p>
      </div>
    </div>
  );
}

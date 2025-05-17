import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';
import { ComponentPreview } from '@/components/docs/component-preview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, Database, Code, Settings } from 'lucide-react';
import { Steps } from '@/components/docs/steps';
import React from 'react';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ className, ...props }) => (
      <h1
        className={cn(
          'mt-2 scroll-m-20 text-4xl font-bold tracking-tight',
          className,
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          'mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
          className,
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
          className,
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }) => (
      <h4
        className={cn(
          'mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
          className,
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
      <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
    ),
    li: ({ className, ...props }) => (
      <li className={cn('mt-2', className)} {...props} />
    ),

    // Blockquote
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn('mt-6 border-l-2 pl-6 italic', className)}
        {...props}
      />
    ),

    // Kode
    code: ({ className, ...props }) => (
      <code
        className={cn(
          'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm',
          className,
        )}
        {...props}
      />
    ),
    pre: CodeBlock,

    // Gambar
    img: (props) => (
      <Image
        className="rounded-md border"
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
        alt=""
      />
    ),

    // Komponen UI
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,

    // Icon
    Terminal,
    Database,
    Code,
    Settings,

    // Komponen Dokumentasi
    Callout,
    ComponentPreview,
    Steps,

    Pre: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      icon?: 'terminal' | 'database' | 'code';
      title?: string;
    }) => (
      <div className="bg-muted my-6 rounded-lg border p-4">
        <div className="flex items-center gap-2 pb-3">
          {props.icon === 'terminal' && <Terminal className="h-4 w-4" />}
          {props.icon === 'database' && <Database className="h-4 w-4" />}
          {props.icon === 'code' && <Code className="h-4 w-4" />}
          {props.title && <p className="text-sm font-medium">{props.title}</p>}
        </div>
        {children}
      </div>
    ),

    ...components,
  };
}

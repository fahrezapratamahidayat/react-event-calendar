import { cn } from '@/lib/utils';

/**
 * Class definitions for typography elements used in documentation
 */
export const typography = {
  h1: (className?: string) =>
    cn(
      'mt-2 scroll-m-20 text-4xl font-bold tracking-tight text-foreground',
      className,
    ),
  h2: (className?: string) =>
    cn(
      'mt-10 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight text-foreground first:mt-0',
      className,
    ),
  h3: (className?: string) =>
    cn(
      'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight text-foreground',
      className,
    ),
  h4: (className?: string) =>
    cn(
      'mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-foreground',
      className,
    ),
  p: (className?: string) =>
    cn('leading-7 text-foreground [&:not(:first-child)]:mt-6', className),
  ul: (className?: string) =>
    cn('my-6 ml-6 list-disc text-foreground', className),
  ol: (className?: string) =>
    cn('my-6 ml-6 list-decimal text-foreground', className),
  li: (className?: string) => cn('mt-2 text-foreground', className),
  inlineCode: (className?: string) =>
    cn(
      'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm text-foreground',
      className,
    ),
  lead: (className?: string) => cn('text-xl text-muted-foreground', className),
  blockquote: (className?: string) =>
    cn('mt-6 border-l-2 border-border pl-6 italic text-foreground', className),
};

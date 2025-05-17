'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CopyIcon, CheckIcon } from 'lucide-react';

export function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  const [isCopied, setIsCopied] = React.useState(false);
  const preRef = React.useRef<HTMLPreElement>(null);

  const copyToClipboard = async () => {
    if (preRef.current?.textContent) {
      await navigator.clipboard.writeText(preRef.current.textContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="group relative my-6">
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-10 h-8 w-8 opacity-0 transition group-hover:opacity-100"
        onClick={copyToClipboard}
        disabled={isCopied}
      >
        {isCopied ? (
          <CheckIcon className="h-4 w-4 text-green-500" />
        ) : (
          <CopyIcon className="h-4 w-4" />
        )}
        <span className="sr-only">Copy code</span>
      </Button>
      <pre
        ref={preRef}
        className={cn(
          'bg-muted dark:bg-muted/50 mt-6 mb-4 overflow-x-auto rounded-lg border px-5 py-4',
          props.className,
        )}
        {...props}
      />
    </div>
  );
}

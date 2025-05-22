'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  preview: React.ReactNode;
  code?: string;
}

export function ComponentPreview({
  preview,
  code,
  className,
  ...props
}: ComponentPreviewProps) {
  return (
    <div
      className={cn('group relative my-8 rounded-md border', className)}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative">
        <div className="flex items-center justify-between border-b">
          <TabsList className="h-10">
            <TabsTrigger value="preview" className="relative">
              Preview
            </TabsTrigger>
            {code && <TabsTrigger value="code">Code</TabsTrigger>}
          </TabsList>
        </div>
        <TabsContent value="preview" className="p-4">
          <div className="flex min-h-[300px] w-full items-center justify-center">
            {preview}
          </div>
        </TabsContent>
        {code && (
          <TabsContent value="code">
            <pre className="overflow-x-auto p-4 text-sm">
              <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {code}
              </code>
            </pre>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

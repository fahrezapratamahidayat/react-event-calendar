'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Clipboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PackageManagerProps {
  inStack?: boolean;
  name?: string;
  sync?: string;
  saveDev?: boolean;
  noSync?: boolean;
  isExecuteCommand?: boolean;
}

interface PackageManager {
  name: string;
  command: string;
  install: string;
  installEmpty: string;
  saveDev: string;
  execute: string;
}

const packageManagers: PackageManager[] = [
  {
    name: 'npm',
    command: 'npm ',
    install: 'install ',
    installEmpty: 'install',
    saveDev: '--save-dev ',
    execute: 'npx ',
  },
  {
    name: 'yarn',
    command: 'yarn ',
    install: 'add ',
    installEmpty: 'install',
    saveDev: '--dev ',
    execute: 'yarn ',
  },
  {
    name: 'pnpm',
    command: 'pnpm ',
    install: 'add ',
    installEmpty: 'install',
    saveDev: '--save-dev ',
    execute: 'pnpm dlx ',
  },
  {
    name: 'bun',
    command: 'bun ',
    install: 'add ',
    installEmpty: 'install',
    saveDev: '--dev ',
    execute: 'bunx --bun ',
  },
];

export const PackageManager = ({
  inStack = false,
  name,
  saveDev = false,
  isExecuteCommand = false,
}: PackageManagerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateCommand = (pm: PackageManager) => {
    if (isExecuteCommand) {
      return `${pm.execute}${name || ''}`;
    }

    if (name) {
      return `${pm.command}${pm.install}${saveDev ? pm.saveDev : ''}${name}`;
    }
    return `${pm.command}${pm.installEmpty}`;
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const activeCommand = generateCommand(packageManagers[activeTab]);

  return (
    <div
      className={cn(
        'bg-background border-border relative overflow-hidden rounded-md border px-2 pt-2',
        !inStack && '[&:not(:first-child)]:mt-5',
      )}
    >
      <div className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex">
            {packageManagers.map((pm, index) => (
              <button
                key={pm.name}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'text-v mb-2 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === index
                    ? 'bg-muted text-foreground rounded-[8px]'
                    : 'hover:bg-muted',
                )}
              >
                {pm.name}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="mr-2 mb-2 h-7 w-7 rounded-[5px]"
            onClick={() => copyToClipboard(activeCommand, activeTab)}
          >
            {copiedIndex === activeTab ? (
              <Check className="h-2 w-2" />
            ) : (
              <Clipboard className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      <div className="relative">
        <div className="relative">
          <pre className="overflow-x-auto p-4 font-mono text-sm">
            <code className="">{activeCommand}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

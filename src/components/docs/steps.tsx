import React from 'react';
import { cn } from '@/lib/utils';
import { Terminal, Database, Code, Settings, Circle } from 'lucide-react';

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

export function Steps({ children, className }: StepsProps) {
  const childrenArray = React.Children.toArray(children);
  const stepsCount = childrenArray.length;

  return (
    <div className={cn('steps-container my-8', className)}>
      <div className="steps-content border-border relative border-l pl-8">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;

          return React.cloneElement(child as React.ReactElement<any>, {
            index: index + 1,
            isLast: index === stepsCount - 1,
          });
        })}
      </div>
    </div>
  );
}

interface StepsItemProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  index?: number;
  isLast?: boolean;
}

function getIconFromTitle(title: string) {
  const lowercaseTitle = title.toLowerCase();

  if (lowercaseTitle.includes('node')) return <Terminal className="h-4 w-4" />;
  if (lowercaseTitle.includes('database'))
    return <Database className="h-4 w-4" />;
  if (lowercaseTitle.includes('package')) return <Code className="h-4 w-4" />;
  if (lowercaseTitle.includes('tools') || lowercaseTitle.includes('setting'))
    return <Settings className="h-4 w-4" />;

  return <Circle className="h-4 w-4" />;
}

export function StepsItem({ icon, title, children }: StepsItemProps) {
  const finalIcon = icon || getIconFromTitle(title);

  return (
    <div className="steps-item mb-8 last:mb-0">
      <div className="steps-indicator bg-background absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium">
        {finalIcon}
      </div>
      <div>
        <h3>{title}</h3>
        <div className="">{children}</div>
      </div>
    </div>
  );
}

Steps.Item = StepsItem;

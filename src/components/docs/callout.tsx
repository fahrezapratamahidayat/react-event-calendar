import { cn } from '@/lib/utils';
import { Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CalloutProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  type?: 'default' | 'warning' | 'danger' | 'info' | 'success';
}

export function Callout({
  children,
  icon,
  type = 'default',
  ...props
}: CalloutProps) {
  const icons = {
    default: null,
    info: <Info className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    danger: <AlertCircle className="h-5 w-5" />,
    success: <CheckCircle2 className="h-5 w-5" />,
  };

  const finalIcon = icon || icons[type];

  return (
    <div
      className={cn('my-6 flex items-start rounded-md border border-l-4 p-4', {
        'border-muted-foreground bg-muted': type === 'default',
        'border-yellow-600 bg-yellow-50 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300':
          type === 'warning',
        'border-red-600 bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300':
          type === 'danger',
        'border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300':
          type === 'info',
        'border-green-600 bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-300':
          type === 'success',
      })}
      {...props}
    >
      {finalIcon && <span className="mr-4 flex-shrink-0">{finalIcon}</span>}
      <div>{children}</div>
    </div>
  );
}

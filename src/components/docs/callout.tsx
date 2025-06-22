import { cn } from '@/lib/utils';
import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const calloutVariants = cva(
  'relative my-6 rounded-lg border px-4 py-3 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'border-border bg-background text-foreground',
        info: 'border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-800/30 dark:bg-blue-950/20 dark:text-blue-100',
        warning:
          'border-amber-200 bg-amber-50/50 text-amber-900 dark:border-amber-800/30 dark:bg-amber-950/20 dark:text-amber-100',
        danger:
          'border-red-200 bg-red-50/50 text-red-900 dark:border-red-800/30 dark:bg-red-950/20 dark:text-red-100',
        success:
          'border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:text-emerald-100',
        note: 'border-violet-200 bg-violet-50/50 text-violet-900 dark:border-violet-800/30 dark:bg-violet-950/20 dark:text-violet-100',
      },
      size: {
        sm: 'px-3 py-2 text-xs [&>svg]:h-3 [&>svg]:w-3 [&>svg]:top-3 [&>svg~*]:pl-6',
        default:
          'px-4 py-3 text-sm [&>svg]:h-4 [&>svg]:w-4 [&>svg]:top-4 [&>svg~*]:pl-7',
        lg: 'px-5 py-4 text-base [&>svg]:h-5 [&>svg]:w-5 [&>svg]:top-5 [&>svg~*]:pl-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
}

export function Callout({
  children,
  icon,
  title,
  variant = 'default',
  size = 'default',
  className,
  ...props
}: CalloutProps) {
  const icons = {
    default: null,
    info: <Info />,
    warning: <AlertTriangle />,
    danger: <AlertCircle />,
    success: <CheckCircle2 />,
    note: <Lightbulb />,
  };

  const finalIcon = icon !== undefined ? icon : icons[variant || 'default'];

  return (
    <div
      className={cn(calloutVariants({ variant, size }), className)}
      role="alert"
      {...props}
    >
      {finalIcon}
      <div className="space-y-1">
        {title && (
          <div className="leading-none font-medium tracking-tight">{title}</div>
        )}
        <div
          className={cn(
            'leading-relaxed',
            title ? 'text-muted-foreground' : '',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function CalloutMinimal({
  children,
  title,
  variant = 'default',
  className,
  ...props
}: Omit<CalloutProps, 'icon' | 'size'>) {
  return (
    <div
      className={cn(
        'bg-muted/30 my-6 rounded-md border-l-4 px-4 py-3 text-sm',
        {
          'border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/10':
            variant === 'info',
          'border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/10':
            variant === 'warning',
          'border-l-red-500 bg-red-50/30 dark:bg-red-950/10':
            variant === 'danger',
          'border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10':
            variant === 'success',
          'border-l-violet-500 bg-violet-50/30 dark:bg-violet-950/10':
            variant === 'note',
          'border-l-border bg-muted/30': variant === 'default',
        },
        className,
      )}
      {...props}
    >
      {title && <div className="text-foreground mb-2 font-medium">{title}</div>}
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}

export function CalloutGhost({
  children,
  title,
  variant = 'default',
  className,
  ...props
}: Omit<CalloutProps, 'icon' | 'size'>) {
  return (
    <div
      className={cn(
        'my-6 rounded-lg px-0 py-2 text-sm',
        {
          'text-blue-700 dark:text-blue-300': variant === 'info',
          'text-amber-700 dark:text-amber-300': variant === 'warning',
          'text-red-700 dark:text-red-300': variant === 'danger',
          'text-emerald-700 dark:text-emerald-300': variant === 'success',
          'text-violet-700 dark:text-violet-300': variant === 'note',
          'text-foreground': variant === 'default',
        },
        className,
      )}
      {...props}
    >
      {title && (
        <div className="mb-1 text-xs font-medium tracking-wider uppercase opacity-60">
          {title}
        </div>
      )}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

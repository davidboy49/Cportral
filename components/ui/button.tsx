import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
          'bg-slate-200 text-slate-900 hover:bg-slate-300': variant === 'secondary',
          'border border-slate-300 bg-white hover:bg-slate-100': variant === 'outline',
          'bg-red-600 text-white hover:bg-red-700': variant === 'destructive'
        },
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';

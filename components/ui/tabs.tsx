'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;
export const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={cn(
      'rounded-md px-3 py-2 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white',
      className
    )}
    {...props}
  />
);

export const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List className={cn('mb-4 flex gap-2 rounded-lg bg-slate-200 p-1', className)} {...props} />
);

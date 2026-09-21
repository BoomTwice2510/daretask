'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-11 items-center justify-center rounded-[24px] border border-slate-200/85 bg-white/90 p-1 text-slate-500 shadow-xs backdrop-blur-2xl select-none',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-[20px] px-4 py-1.5 text-xs sm:text-sm font-bold text-slate-600 transition-all duration-200 outline-none',
      'hover:text-slate-900',
      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0052FF]/15',
      'disabled:pointer-events-none disabled:opacity-40',
      'data-[state=active]:bg-blue-50/80 data-[state=active]:text-[#0052FF] data-[state=active]:shadow-[0_2px_10px_rgba(0,82,255,0.16)]',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-3 outline-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0052FF]/15 focus-visible:rounded-2xl',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
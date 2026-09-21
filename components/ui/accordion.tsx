'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'group/item relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 backdrop-blur-2xl shadow-[0_4px_20px_rgba(15,23,42,0.035)] transition-all duration-300',
      'data-[state=open]:border-[#0052FF]/40 data-[state=open]:shadow-[0_10px_30px_rgba(0,82,255,0.08)] data-[state=open]:ring-2 data-[state=open]:ring-blue-100/60',
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between p-5 text-left text-sm sm:text-base font-black tracking-tight text-slate-900 transition-all duration-200 cursor-pointer select-none',
        'hover:text-[#0052FF]',
        '[&[data-state=open]>div>svg]:rotate-180 [&[data-state=open]>div]:border-blue-200/80 [&[data-state=open]>div]:bg-blue-50/70 [&[data-state=open]>div]:text-[#0052FF]',
        className
      )}
      {...props}
    >
      <span className="flex-1 pr-3">{children}</span>
      
      {/* 3D Glass Capsule Chevron */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 shadow-xs transition-all duration-300 group-hover/item:border-[#0052FF]/30 group-hover/item:text-slate-700">
        <ChevronDown className="h-4 w-4 stroke-[2.4] transition-transform duration-300" />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-xs sm:text-sm leading-relaxed text-slate-600 font-medium transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('px-5 pb-5 pt-1 border-t border-slate-100/90 text-slate-500 font-medium', className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
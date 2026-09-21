'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2.5', className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'peer aspect-square h-5 w-5 shrink-0 rounded-full border border-slate-300/80 bg-white/95 shadow-xs backdrop-blur-md transition-all duration-200 cursor-pointer select-none',
        'hover:border-blue-400 hover:shadow-[0_2px_8px_rgba(0,82,255,0.12)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:border-slate-200 disabled:bg-slate-100/50',
        'data-[state=checked]:border-[#0052FF] data-[state=checked]:bg-white data-[state=checked]:text-[#0052FF] data-[state=checked]:shadow-[0_3px_10px_rgba(0,82,255,0.22)]',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center text-current">
        <Circle className="h-2.5 w-2.5 fill-[#0052FF] text-[#0052FF] animate-in zoom-in-75 duration-150" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
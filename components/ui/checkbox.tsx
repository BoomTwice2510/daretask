'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer relative h-5 w-5 shrink-0 rounded-lg border border-slate-300/80 bg-white/95 shadow-xs backdrop-blur-md transition-all duration-200 cursor-pointer select-none',
      'hover:border-blue-400 hover:shadow-[0_2px_8px_rgba(0,82,255,0.12)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-40 disabled:border-slate-200 disabled:bg-slate-100/50',
      'data-[state=checked]:border-[#0052FF] data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-[#0052FF] data-[state=checked]:to-[#0045d8] data-[state=checked]:text-white data-[state=checked]:shadow-[0_3px_10px_rgba(0,82,255,0.28)]',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-white')}
    >
      <Check className="h-3.5 w-3.5 stroke-[3] transition-transform duration-150 animate-in zoom-in-75" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-slate-200/80 p-0.5 shadow-inner backdrop-blur-xl transition-all duration-300 select-none outline-none',
      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0052FF]/15',
      'disabled:cursor-not-allowed disabled:opacity-40 disabled:border-slate-200',
      'data-[state=unchecked]:bg-slate-200/70 hover:data-[state=unchecked]:bg-slate-200',
      'data-[state=checked]:border-[#0052FF]/40 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#0052FF] data-[state=checked]:to-[#0045d8] data-[state=checked]:shadow-[0_2px_10px_rgba(0,82,255,0.28)]',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(15,23,42,0.18)] ring-0 transition-transform duration-300 ease-out will-change-transform',
        'data-[state=checked]:translate-x-5 data-[state=checked]:shadow-[0_2px_10px_rgba(0,82,255,0.35)]',
        'data-[state=unchecked]:translate-x-0',
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
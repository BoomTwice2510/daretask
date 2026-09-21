'use client'

import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 select-none font-bold text-slate-600 transition-all duration-200 outline-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0052FF]/15 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-transparent hover:bg-slate-100/80 hover:text-slate-900 data-[state=on]:bg-blue-50/80 data-[state=on]:text-[#0052FF]',
        outline:
          'border border-slate-200/85 bg-white/90 shadow-xs backdrop-blur-xl hover:border-slate-300 hover:bg-white hover:text-slate-900 data-[state=on]:border-[#0052FF] data-[state=on]:bg-blue-50/80 data-[state=on]:text-[#0052FF] data-[state=on]:shadow-[0_4px_14px_rgba(0,82,255,0.18)]',
      },
      size: {
        default: 'h-11 min-w-11 px-3.5 rounded-2xl text-xs sm:text-sm',
        sm: 'h-9 min-w-9 px-2.5 rounded-xl text-xs',
        lg: 'h-12 min-w-12 px-5 rounded-[20px] text-sm sm:text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
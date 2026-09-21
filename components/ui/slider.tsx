'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center py-2 cursor-pointer',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2.5 w-full grow overflow-hidden rounded-full border border-slate-200/80 bg-slate-100/80 p-[1px] shadow-inner backdrop-blur-xl">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-r from-[#0052FF] to-[#0045d8] shadow-[0_1px_8px_rgba(0,82,255,0.35)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[#0052FF] bg-white shadow-[0_4px_14px_rgba(0,82,255,0.28)] outline-none transition-all duration-150 hover:scale-110 focus-visible:scale-110 focus-visible:ring-4 focus-visible:ring-[#0052FF]/20 active:scale-95 disabled:pointer-events-none disabled:opacity-40" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
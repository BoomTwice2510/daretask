import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-2xl border border-slate-200/85 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-xs backdrop-blur-xl transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal',
          'hover:border-slate-300 hover:bg-white',
          'focus-visible:outline-none focus-visible:border-[#0052FF] focus-visible:ring-4 focus-visible:ring-[#0052FF]/15 focus-visible:bg-white',
          'disabled:cursor-not-allowed disabled:opacity-40 disabled:border-slate-200 disabled:bg-slate-50/50',
          'file:border-0 file:bg-blue-50/80 file:px-3 file:py-1 file:rounded-xl file:text-xs file:font-black file:text-[#0052FF] file:mr-3 file:cursor-pointer',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
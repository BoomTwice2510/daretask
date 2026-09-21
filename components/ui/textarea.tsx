import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[100px] w-full rounded-[24px] border border-slate-200/85 bg-white/90 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 shadow-xs backdrop-blur-2xl transition-all duration-200 placeholder:text-slate-400',
        'hover:border-slate-300 hover:bg-white',
        'focus:outline-none focus:border-[#0052FF] focus:bg-white focus:ring-4 focus:ring-[#0052FF]/15',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:border-slate-200 disabled:bg-slate-50/50',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
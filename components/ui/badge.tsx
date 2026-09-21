import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-black uppercase tracking-[0.14em] backdrop-blur-md shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-blue-200/80 bg-blue-50/90 text-[#0052FF] hover:bg-blue-100/90 hover:border-blue-300',
        secondary:
          'border-slate-200/80 bg-slate-50/90 text-slate-700 hover:bg-slate-100/90',
        destructive:
          'border-rose-200/80 bg-rose-50/90 text-rose-700 hover:bg-rose-100/90',
        success:
          'border-emerald-200/80 bg-emerald-50/90 text-emerald-700 hover:bg-emerald-100/90',
        warning:
          'border-amber-200/80 bg-amber-50/90 text-amber-800 hover:bg-amber-100/90',
        outline:
          'border-slate-200/90 bg-white/95 text-slate-700 hover:bg-slate-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
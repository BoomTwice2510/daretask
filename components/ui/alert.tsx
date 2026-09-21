import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-[24px] border p-4.5 sm:p-5 backdrop-blur-2xl shadow-[0_4px_20px_rgba(15,23,42,0.035)] transition-all duration-200 [&>svg~*]:pl-11 [&>svg]:absolute [&>svg]:left-4.5 [&>svg]:top-4.5 sm:[&>svg]:left-5 sm:[&>svg]:top-5 [&>svg]:h-5 [&>svg]:w-5',
  {
    variants: {
      variant: {
        default:
          'border-slate-200/85 bg-white/90 text-slate-900 shadow-xs [&>svg]:text-[#0052FF]',
        destructive:
          'border-rose-200/80 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/40 text-rose-900 shadow-[0_8px_24px_rgba(244,63,94,0.08)] [&>svg]:text-rose-600',
        success:
          'border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 text-emerald-950 shadow-[0_8px_24px_rgba(16,185,129,0.08)] [&>svg]:text-emerald-600',
        warning:
          'border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 text-amber-950 shadow-[0_8px_24px_rgba(245,158,11,0.08)] [&>svg]:text-amber-600',
        info:
          'border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/40 text-slate-900 shadow-[0_8px_24px_rgba(0,82,255,0.08)] [&>svg]:text-[#0052FF]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 text-sm sm:text-base font-black tracking-tight leading-snug', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-xs sm:text-sm font-medium leading-relaxed text-slate-600 [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
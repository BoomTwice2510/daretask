import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs sm:text-sm font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'rounded-2xl bg-gradient-to-b from-[#0052FF] to-[#0045d8] text-white shadow-[0_4px_16px_rgba(0,82,255,0.24)] hover:to-[#003bb8] hover:shadow-[0_8px_24px_rgba(0,82,255,0.34)]',
        destructive:
          'rounded-2xl bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.22)] hover:to-rose-700 hover:shadow-[0_8px_24px_rgba(244,63,94,0.3)]',
        outline:
          'rounded-2xl border border-slate-200/85 bg-white/90 text-slate-700 shadow-xs backdrop-blur-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900',
        secondary:
          'rounded-2xl border border-blue-200/70 bg-blue-50/90 text-[#0052FF] shadow-xs hover:bg-blue-100/80 hover:border-blue-300',
        ghost:
          'rounded-2xl text-slate-600 hover:bg-slate-100/80 hover:text-slate-900',
        link:
          'text-[#0052FF] underline-offset-4 hover:underline active:scale-100',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-xl px-3.5 text-xs',
        lg: 'h-12 rounded-[20px] px-8 text-sm sm:text-base',
        icon: 'h-10 w-10 rounded-2xl p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
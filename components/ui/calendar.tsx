'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'rounded-[28px] border border-slate-200/85 bg-white/95 p-4 shadow-[0_12px_36px_rgba(15,23,42,0.06)] backdrop-blur-2xl',
        className
      )}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1.5 relative items-center',
        caption_label: 'text-sm font-black tracking-tight text-slate-900',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-8 w-8 rounded-xl border-slate-200/80 bg-white/90 p-0 text-slate-600 shadow-xs hover:border-blue-300/80 hover:bg-blue-50/60 hover:text-[#0052FF]'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-slate-400 rounded-xl w-9 font-black text-[0.75rem] uppercase tracking-wider',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-2xl [&:has([aria-selected].day-outside)]:bg-blue-50/40 [&:has([aria-selected])]:bg-blue-50/70 first:[&:has([aria-selected])]:rounded-l-2xl last:[&:has([aria-selected])]:rounded-r-2xl focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 rounded-xl p-0 font-bold text-xs text-slate-700 transition-all hover:bg-blue-50 hover:text-[#0052FF] aria-selected:opacity-100'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-gradient-to-b from-[#0052FF] to-[#0045d8] text-white shadow-[0_4px_12px_rgba(0,82,255,0.28)] hover:to-[#003bb8] hover:text-white focus:to-[#003bb8] focus:text-white',
        day_today: 'border border-blue-200 bg-blue-50/80 font-black text-[#0052FF]',
        day_outside:
          'day-outside text-slate-300 aria-selected:bg-blue-50/40 aria-selected:text-slate-400',
        day_disabled: 'text-slate-300 opacity-40',
        day_range_middle:
          'aria-selected:bg-blue-50 aria-selected:text-[#0052FF]',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4 stroke-[2.4]" {...props} />
          ) : (
            <ChevronRight className="h-4 w-4 stroke-[2.4]" {...props} />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
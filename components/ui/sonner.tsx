'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:rounded-[24px] group-[.toaster]:border group-[.toaster]:border-slate-200/85 group-[.toaster]:bg-white/95 group-[.toaster]:p-4 group-[.toaster]:text-slate-900 group-[.toaster]:shadow-[0_20px_50px_rgba(15,23,42,0.12)] group-[.toaster]:backdrop-blur-2xl',
          title: 'group-[.toast]:text-xs sm:group-[.toast]:text-sm group-[.toast]:font-black group-[.toast]:tracking-tight group-[.toast]:text-slate-900',
          description: 'group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:leading-relaxed group-[.toast]:text-slate-500',
          actionButton:
            'group-[.toast]:h-9 group-[.toast]:rounded-xl group-[.toast]:bg-gradient-to-b group-[.toast]:from-[#0052FF] group-[.toast]:to-[#0045d8] group-[.toast]:px-3.5 group-[.toast]:text-xs group-[.toast]:font-black group-[.toast]:text-white group-[.toast]:shadow-[0_4px_14px_rgba(0,82,255,0.28)] group-[.toast]:transition-transform active:group-[.toast]:scale-95',
          cancelButton:
            'group-[.toast]:h-9 group-[.toast]:rounded-xl group-[.toast]:border group-[.toast]:border-slate-200/80 group-[.toast]:bg-slate-100/80 group-[.toast]:px-3.5 group-[.toast]:text-xs group-[.toast]:font-bold group-[.toast]:text-slate-600 hover:group-[.toast]:bg-slate-200/70 hover:group-[.toast]:text-slate-900 active:group-[.toast]:scale-95',
          closeButton:
            'group-[.toast]:border-slate-200/85 group-[.toast]:bg-white/90 group-[.toast]:text-slate-400 hover:group-[.toast]:text-slate-700 hover:group-[.toast]:bg-slate-50',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
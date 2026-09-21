import Image from "next/image";
import { Sparkles } from "lucide-react";

export function PageBrand({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 flex items-center gap-4 sm:gap-5">
      {/* 3D Frosted Glass Logo Squircle with Ambient Aura */}
      <div className="group relative flex h-14 w-14 sm:h-20 sm:w-20 shrink-0 items-center justify-center overflow-hidden rounded-[24px] sm:rounded-[28px] border border-blue-200/70 bg-gradient-to-br from-blue-50/90 via-white to-blue-100/60 p-2 shadow-[0_8px_24px_rgba(0,82,255,0.12)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_32px_rgba(0,82,255,0.22)]">
        {/* Soft Ambient Inner Glow */}
        <div className="pointer-events-none absolute inset-1 rounded-[20px] bg-blue-400/10 blur-xs" />
        
        <Image
          src="/images/logo-gold.png"
          alt="Dare Protocol"
          width={72}
          height={72}
          className="relative z-10 h-full w-full object-contain drop-shadow-xs transition-transform duration-300 group-hover:rotate-6"
          priority
        />
      </div>

      {/* Typography Block */}
      <div className="min-w-0 flex-1">
        {/* Iridescent Eyebrow Badge */}
        <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 px-2.5 py-0.5 text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-[0.18em] text-[#0052FF] shadow-xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0052FF] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0052FF]" />
          </span>
          {eyebrow}
        </div>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>

        {/* Optional Description */}
        {description && (
          <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
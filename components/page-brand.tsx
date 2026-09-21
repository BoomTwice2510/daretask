import Image from "next/image";

export function PageBrand({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-8 flex items-center gap-4 sm:gap-5">
      <div className="brand-logo-tile hidden sm:flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-slate-950 p-2 ring-1 ring-slate-200 shadow-[0_12px_30px_rgba(15,23,42,.12)]">
        <Image src="/images/logo-gold.png" alt="Dare Protocol" width={72} height={72} className="h-full w-full object-contain" priority />
      </div>
      <div className="min-w-0">
        <p className="mb-1 text-[10px] font-black uppercase tracking-[.22em] text-[#6b9fdd]">{eyebrow}</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
    </div>
  );
}

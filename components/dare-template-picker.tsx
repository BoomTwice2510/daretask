"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Sparkles, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";
import {
  FLASH_TASK_CATEGORIES,
  secondsToDuration,
  type FlashTaskCategory,
  type FlashTaskTemplate,
} from "@/lib/flash-templates";
import { cn } from "@/lib/utils";

function applyTemplate(
  router: ReturnType<typeof useRouter>,
  template: FlashTaskTemplate,
  category: FlashTaskCategory
) {
  router.push(
    `/create?${new URLSearchParams({
      flashTitle: template.title,
      flashDesc: template.description,
      flashProof: `${template.proofType}`,
      flashDeadline: String(template.deadline),
      flashCategory: category.name,
    }).toString()}#builder`
  );
}

export function DareTemplatePicker() {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(FLASH_TASK_CATEGORIES[0]?.id || "");

  const category =
    FLASH_TASK_CATEGORIES.find((x) => x.id === categoryId) ?? FLASH_TASK_CATEGORIES[0];

  if (!category) return null;

  return (
    <div className="space-y-4">
      {/* Category Pills Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar sm:grid sm:grid-cols-3 lg:grid-cols-5">
        {FLASH_TASK_CATEGORIES.map((item) => {
          const isSelected = item.id === category.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategoryId(item.id)}
              className={cn(
                "group relative flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-black transition-all duration-200 cursor-pointer active:scale-95",
                isSelected
                  ? "bg-gradient-to-r from-[#0052FF] to-[#0045d8] text-white shadow-[0_4px_16px_rgba(0,82,255,0.28)] scale-[1.02]"
                  : "glass-card-interactive border border-slate-200/80 bg-white/90 text-slate-600 hover:text-slate-900 hover:bg-white"
              )}
            >
              <span className="text-base transition-transform duration-200 group-hover:scale-110" aria-hidden>
                {item.emoji}
              </span>
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Category Description Banner */}
      <div className="glass-panel flex items-center justify-between rounded-2xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-[#0052FF]" />
          <span>{category.description}</span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
          {category.templates.length} Templates
        </span>
      </div>

      {/* Template Cards 3-Column Grid */}
      <div className="grid gap-3.5 md:grid-cols-3">
        {category.templates.map((template) => {
          const duration = secondsToDuration(template.deadline);

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => applyTemplate(router, template, category)}
              className="glass-card-interactive group relative flex flex-col justify-between overflow-hidden rounded-[26px] p-5 text-left transition-all duration-300 cursor-pointer"
            >
              {/* Subtle Card Ambient Glow */}
              <div className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full bg-blue-100/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Top Row: 3D Micro-Glass Icon & Chevron */}
                <div className="flex items-start justify-between gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50/90 via-white to-blue-100/60 border border-blue-200/80 shadow-[0_4px_14px_rgba(0,82,255,0.12)] group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                    <div className="absolute inset-1 rounded-xl bg-blue-400/10 blur-xs" />
                    <span className="relative z-10 text-2xl" aria-hidden>
                      {category.emoji}
                    </span>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/70 bg-white/90 text-slate-400 group-hover:text-[#0052FF] group-hover:border-blue-200/80 group-hover:scale-105 transition-all shadow-xs">
                    <ArrowUpRight className="h-4 w-4 stroke-[2.2] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Challenge Title */}
                <h3 className="mt-4 text-sm sm:text-base font-black tracking-tight text-slate-900 group-hover:text-[#0052FF] transition-colors leading-snug">
                  {template.title}
                </h3>

                {/* Challenge Description */}
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 font-medium">
                  {template.description}
                </p>
              </div>

              {/* Badges Footer */}
              <div className="mt-5 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100/90">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200/70 px-2.5 py-1 text-[10.5px] font-bold text-slate-700 shadow-xs">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {duration.value} {duration.type === "hours" ? "hours" : "days"}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50/90 border border-emerald-200/70 px-2.5 py-1 text-[10.5px] font-black text-emerald-700 shadow-xs">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  {template.proofType}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
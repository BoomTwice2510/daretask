"use client";
import React,{ useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { FLASH_TASK_CATEGORIES,secondsToDuration,type FlashTaskCategory,type FlashTaskTemplate } from "@/lib/flash-templates";
import { cn } from "@/lib/utils";

function applyTemplate(router:ReturnType<typeof useRouter>,template:FlashTaskTemplate,category:FlashTaskCategory){router.push(`/create?${new URLSearchParams({flashTitle:template.title,flashDesc:template.description,flashProof:`${template.proofType}`,flashDeadline:String(template.deadline),flashCategory:category.name}).toString()}#builder`)}

export function DareTemplatePicker(){
 const router=useRouter(); const [categoryId,setCategoryId]=useState(FLASH_TASK_CATEGORIES[0]?.id||"");
 const category=FLASH_TASK_CATEGORIES.find(x=>x.id===categoryId)??FLASH_TASK_CATEGORIES[0];
 if(!category)return null;
 return <div>
  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{FLASH_TASK_CATEGORIES.map(item=><button key={item.id} type="button" onClick={()=>setCategoryId(item.id)} className={cn("flex min-h-10 items-center justify-center gap-2 rounded-full px-2 text-[10px] font-bold transition",item.id===category.id?"bg-[#0052ff] text-white shadow-[0_8px_20px_rgba(0,82,255,.14)]":"bg-slate-50 text-slate-500 hover:bg-slate-100") }><span aria-hidden>{item.emoji}</span><span className="truncate">{item.name}</span></button>)}</div>
  <p className="mt-3 text-xs text-slate-500">{category.description}</p>
  <div className="mt-4 grid gap-3 md:grid-cols-3">{category.templates.map(template=>{const duration=secondsToDuration(template.deadline);return <button key={template.id} type="button" onClick={()=>applyTemplate(router,template,category)} className="group rounded-3xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#0052ff]/30 hover:shadow-sm"><div className="flex items-start justify-between gap-3"><span className="text-2xl" aria-hidden>{category.emoji}</span><ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0052ff]"/></div><h3 className="mt-4 text-sm font-bold text-slate-900">{template.title}</h3><p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">{template.description}</p><div className="mt-4 flex flex-wrap gap-1.5"><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{duration.value} {duration.type==="hours"?"hr":"days"}</span><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{template.proofType}</span></div></button>})}</div>
 </div>
}

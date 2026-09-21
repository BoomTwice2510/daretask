"use client";
import { useCallback,useEffect,useState } from "react";
import { useWeb3 } from "@/lib/web3-provider";
export function LiveProtocolStats(){
 const {readContract}=useWeb3(); const [s,setS]=useState({total:0,active:0}); const [loading,setLoading]=useState(true);
 const load=useCallback(async()=>{try{const total=Number(await readContract("dareCount"));let active=0;const start=Math.max(0,total-100);for(let i=start;i<total;i++){try{const d=await readContract("getDare",[BigInt(i)]) as any[];if(Number(d[11])<=3)active++;}catch{}}setS({total,active});}catch{setS({total:0,active:0});}finally{setLoading(false)}},[readContract]);
 useEffect(()=>{load()},[load]); const n=(x:number)=>loading?"—":x.toLocaleString();
 return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#eef4ff] px-4 py-3"><b className="block text-xl font-black text-slate-950">{n(s.total)}</b><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dares created</span></div><div className="rounded-2xl bg-[#ecfdf3] px-4 py-3"><b className="block text-xl font-black text-slate-950">{n(s.active)}</b><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active now</span></div><div className="col-span-2 rounded-2xl bg-[#f6f0ff] px-4 py-3 sm:col-span-1"><b className="block text-xl font-black text-slate-950">Base</b><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">On-chain network</span></div></div>
}

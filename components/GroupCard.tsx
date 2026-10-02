
'use client'
import { useState } from 'react'
export default function GroupCard({group, wallets}: any){
  return (
    <div className={`${group.color} rounded-[16px] p-[14px] mb-[10px] text-white border-[3px] border-black/20`}>
      <div className="flex justify-between font-bold">{group.nama} <span className="bg-white text-black w-5 h-5 rounded-full text-center text-xs">+</span></div>
      <div className="text-xs opacity-90 mt-1">{group.desc}</div>
      {wallets.filter((w:any)=>w.group_type===group.id).map((w:any)=><WalletItem key={w.id} w={w} />)}
    </div>
  )
}
function WalletItem({w}: any){
  const [show,setShow]=useState(false)
  const [copied,setCopied]=useState(false)
  const masked = w.no_rek ? w.no_rek.slice(0,4)+' **** '+w.no_rek.slice(-4) : '**** ****'
  const display = show ? w.no_rek : masked
  const copy = ()=>{navigator.clipboard.writeText(w.no_rek); setCopied(true); setTimeout(()=>setCopied(false),1500)}
  return (
    <div className="bg-black/20 rounded-[10px] p-3 mt-2">
      <div className="flex justify-between font-semibold"><span>{w.name}</span><span>Rp {w.saldo?.toLocaleString('id-ID')}</span></div>
      <div className="flex items-center gap-2 mt-1 text-[11px]">
        <span>No: {display}</span>
        <button onClick={()=>setShow(!show)} className="bg-white/20 px-2 py-0.5 rounded-full">{show?'🙈':'👁️'}</button>
        <button onClick={copy} className="bg-white/20 px-2 py-0.5 rounded-full">{copied?'✅':'📋 Copy'}</button>
      </div>
    </div>
  )
}

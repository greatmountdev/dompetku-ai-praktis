
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { pantun, prioritas } from '@/lib/pantun'
import GroupCard from '@/components/GroupCard'

type Step = 'daftar' | 'pola' | 'izin' | 'tanggungan' | 'app'

export default function Page(){
  const [step,setStep]=useState<Step>('daftar')
  const [email,setEmail]=useState('')
  const [nickname,setNickname]=useState('Bro')
  const [pattern,setPattern]=useState<number[]>([])
  const [tanggungan,setTanggungan]=useState<string[]>([])
  const [theme,setTheme]=useState<'terang'|'gelap'>('terang')
  const [font,setFont]=useState<'elegan'|'alay'|'klasik'|'manula'>('elegan')

  // ONE PACKAGE: daftar + isi = wallets sample langsung jadi milik user
  const [wallets,setWallets]=useState([
    {id:'1', group_type:'tabungan', name:'BCA', bank:'BCA', no_rek:'1234567890123456', saldo:2500000, color:'bg-[#2563eb]'},
    {id:'2', group_type:'saku', name:'OVO', bank:'OVO', no_rek:'081234567890', saldo:275000, color:'bg-[#7c3aed]'},
    {id:'3', group_type:'pengeluaran', name:'Seblak', bank:'Cash', no_rek:'', saldo:0, color:'bg-[#dc2626]'},
    {id:'4', group_type:'darurat', name:'BCA Darurat', bank:'BCA', no_rek:'9876543210', saldo:0, color:'bg-[#16a34a]'},
  ])

  const daftar = async()=>{
    // Supabase Auth + insert user - ONE PACKAGE langsung isi wallets
    const {data} = await supabase.auth.signUp({email, password:'12345678'})
    if(data.user){
      await supabase.from('users').insert({id:data.user.id, email, nickname, tanggungan, pattern})
      // insert wallets sample as milik user (daftar + isi satu paket)
      for(const w of wallets){
        await supabase.from('wallets').insert({...w, user_id:data.user.id})
      }
    }
    setStep('pola')
  }

  const groups = prioritas.map(p=>({id:p.id, nama:p.nama, color:p.warna, desc:p.desc}))

  return (
    <div className={`min-h-[100dvh] max-w-[420px] mx-auto flex flex-col ${theme==='gelap'?'bg-[#0a0a0a] text-white':'bg-white text-black'} font-${font}`}>
      {step!=='app' && <div className="flex gap-2 justify-center p-3">{['daftar','pola','izin','tanggungan'].map((s,i)=><div key={s} className={`w-8 h-2 rounded-full ${['daftar','pola','izin','tanggungan'].indexOf(step)>=i?'bg-black':'bg-gray-200'}`} />)}</div>}

      {step==='daftar' && (
        <div className="p-6 flex-1">
          <h1 className="text-2xl font-black">DompetKu AI - Daftar + Isi Satu Paket</h1>
          <p className="text-sm opacity-70 mt-1">APK Google - Daftar langsung ada isinya, praktis!</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email Google" className="w-full mt-6 p-3 border-2 rounded-xl" />
          <input value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="Nama Panggilan (Bro/Kang/Teh)" className="w-full mt-3 p-3 border-2 rounded-xl" />
          <button onClick={daftar} className="w-full mt-6 bg-black text-white p-3 rounded-xl font-bold">Daftar dengan Google 🚀</button>
          <div className="text-xs mt-4 p-3 bg-yellow-50 border rounded-xl">Paket praktis: Daftar → Pola → Izin Drive/Sheet/Gemini → Tanggungan → Langsung ada saldo contoh & bisa langsung pakai!</div>
        </div>
      )}

      {step==='pola' && (
        <div className="p-6 flex-1">
          <h2 className="font-bold text-xl">Buat Pola Keamanan 🔐</h2>
          <p className="text-sm">Kayak HP Samsung lu, drag 4 titik</p>
          <div className="grid grid-cols-3 gap-6 mt-8 w-60 mx-auto">
            {[0,1,2,3,4,5,6,7,8].map(i=><button key={i} onClick={()=>setPattern([...pattern,i])} className={`w-14 h-14 rounded-full border-4 ${pattern.includes(i)?'bg-black border-black':'border-gray-300'}`} />)}
          </div>
          <div className="text-center text-sm mt-4">Pola: {pattern.join(' - ')} {pattern.length>=4 && '✅'}</div>
          <button onClick={()=>setStep('izin')} disabled={pattern.length<4} className="w-full mt-8 bg-black text-white p-3 rounded-xl font-bold disabled:opacity-30">Simpan Pola & Lanjut</button>
        </div>
      )}

      {step==='izin' && (
        <div className="p-6 flex-1">
          <h2 className="font-bold text-xl">Izinin Akses Google 🙏</h2>
          <div className="space-y-3 mt-6">
            {[
              {icon:'📁', name:'Google Drive', desc:'Simpan foto struk & backup dompet'},
              {icon:'📊', name:'Google Sheet', desc:'Export laporan warna-warni'},
              {icon:'✨', name:'Gemini Chat', desc:'Bot penasehat keuangan gaul pantun'},
            ].map(i=>(
              <div key={i.name} className="border-2 p-3 rounded-xl flex gap-3"><div className="text-2xl">{i.icon}</div><div><div className="font-bold text-sm">{i.name}</div><div className="text-xs opacity-70">{i.desc}</div></div><div className="ml-auto"><input type="checkbox" defaultChecked /></div></div>
            ))}
          </div>
          <button onClick={()=>setStep('tanggungan')} className="w-full mt-8 bg-[#16a34a] text-white p-3 rounded-xl font-bold">Izinkan Semua & Lanjut</button>
        </div>
      )}

      {step==='tanggungan' && (
        <div className="p-6 flex-1">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
            <div className="font-black">💬 Momo: Selamat datang {nickname}! 🎉</div>
            <div className="text-sm mt-2">Akhirnya lu daftar juga! Gue Momo, asisten keuangan lu biar gak boncos terus! Cakep!</div>
          </div>
          <h3 className="font-bold mt-6">Lu punya tanggungan gak {nickname}?</h3>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              {id:'orangtua', label:'👨‍👩‍👧 Orang Tua'},
              {id:'adek', label:'👦 Adek'},
              {id:'anak', label:'👶 Anak'},
              {id:'istri', label:'👩 Istri/Suami'},
              {id:'single', label:'😎 Single Bebas'},
            ].map(o=>(
              <button key={o.id} onClick={()=>setTanggungan(prev=>prev.includes(o.id)?prev.filter(x=>x!==o.id):[...prev,o.id])} className={`p-3 border-2 rounded-xl text-sm font-bold ${tanggungan.includes(o.id)?'bg-black text-white':'bg-white'}`}>{o.label}</button>
            ))}
          </div>
          {tanggungan.length>0 && (
            <div className="mt-4 p-3 bg-blue-50 border rounded-xl text-sm whitespace-pre-line">
              <div className="font-bold">Pantun buat lu:</div>
              {pantun[tanggungan[0] as keyof typeof pantun]}
              <div className="mt-3 font-bold">Prioritas keuangan {nickname}:</div>
              {prioritas.map((p,i)=><div key={p.id}>{i+1}. {p.nama} - {p.desc}</div>)}
            </div>
          )}
          <button onClick={()=>setStep('app')} className="w-full mt-6 bg-black text-white p-3 rounded-xl font-bold">Siap Atur Keuangan! 🚀</button>
        </div>
      )}

      {step==='app' && (
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b-2 flex items-center justify-between px-3">
            <span>☰</span><b>Yo {nickname}! Yo! Catat hari ini ya!</b>
            <div className="flex gap-2">
              <button onClick={()=>setTheme(theme==='terang'?'gelap':'terang')} className="text-xs border px-2 py-1 rounded-full">{theme==='terang'?'🌙':'☀️'}</button>
              <select value={font} onChange={e=>setFont(e.target.value as any)} className="text-xs border rounded-full px-1">
                <option value="elegan">Elegan</option><option value="alay">Alay</option><option value="klasik">Klasik</option><option value="manula">Manula Bold</option>
              </select>
            </div>
          </div>
          <div className="p-3 flex-1 overflow-auto">
            {groups.map(g=><GroupCard key={g.id} group={g} wallets={wallets} />)}
            <div className="mt-6 border-2 p-3 rounded-xl">
              <div className="font-bold text-sm">📊 Laporan Harian - Grafik + Tabel + Export Sheet</div>
              <div className="flex items-end gap-1 h-20 mt-3">{[30,45,60,80,50,100,40].map((h,i)=><div key={i} style={{height:`${h}%`}} className={`flex-1 rounded-t ${i===5?'bg-red-500':'bg-blue-500'}`} />)}</div>
              <div className="text-[10px] mt-1">Paling boros Sabtu merah 350k</div>
              <button onClick={()=>alert('Export ke Google Sheet - warna grup: biru, ungu, merah, orange, ijo text putih - border aesthetic!')} className="w-full mt-3 bg-[#16a34a] text-white p-2 rounded-xl text-sm font-bold">📊 Export ke Google Sheet</button>
            </div>
          </div>
          <div className="h-16 border-t-2 grid grid-cols-4 text-[10px]">
            <div className="flex flex-col items-center justify-center font-bold bg-gray-100">💬 Chat</div>
            <div className="flex flex-col items-center justify-center">📜 Riwayat + Foto</div>
            <div className="flex flex-col items-center justify-center">📊 Laporan</div>
            <div className="flex flex-col items-center justify-center">👤 Akun</div>
          </div>
        </div>
      )}
    </div>
  )
}

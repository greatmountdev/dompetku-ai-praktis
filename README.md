
# DompetKu AI - Paket Praktis Daftar + Isi

## 1 Paket = Daftar + Isi langsung (bukan 2 file terpisah)
- Daftar email google
- Pola pattern kayak HP Samsung
- Izin Drive (foto), Sheet (export laporan), Gemini (bot)
- Bot Momo gaul pantun tanya tanggungan orang tua/adek/anak/istri/single
- Langsung ada wallets contoh dengan no rek hide/show copy

## Deploy Vercel (frontend dulu)
1. Push ke GitHub: git init, git add ., git commit -m "dompetku", git push
2. Vercel.com → New Project → Import repo → Deploy
3. Env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

## Supabase (backend)
SQL:
```sql
create table users (id uuid primary key, email text, nickname text, tanggungan jsonb, pattern jsonb, created_at timestamp default now());
create table wallets (id text primary key, user_id uuid references users(id), group_type text, name text, bank text, no_rek text, saldo bigint);
create table transactions (id uuid primary key default gen_random_uuid(), user_id uuid, wallet_id text, type text, amount bigint, description text, photo_url text, sisa bigint, created_at timestamp default now());
-- Storage bucket dompetku-photos (public)
-- Enable RLS and policies
```
- Supabase Auth Google Provider ON
- Storage bucket buat foto struk

## Fitur
- 5 grup warna penuh solid text putih: biru tabungan, ungu saku, merah pengeluaran, orange cicilan, ijo darurat
- No rek hide/show eye + copy 📋 per wallet
- Riwayat pemasukan/pengeluaran + foto thumbnail
- Laporan grafik (paling boros merah) + tabel border aesthetic + export Sheet
- Tema terang/gelap, font elegan/alay/klasik/manula bold instant

## Vercel vs Supabase mana dulu?
Vercel dulu biar ada link demo, baru Supabase biar data kesimpen.

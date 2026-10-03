# DompetKu AI V2 Fixed

Fix sesuai request:
- Login + Facebook + Google (sembunyiin deskripsi panjang jadi icon info)
- Pola interaktif soft mengikuti garis (canvas SVG + glow, vibrate)
- Chat Meta AI pakai suara (Web Speech API STT+TTS)
- Navigasi slide kiri berupa grup menu (fix scroll kepanjangan)
- APK logic dipertahankan

## Cara push ke GitHub dompetku-ai-praktis

1. Buka github.com -> repo dompetku-ai-praktis
2. Upload/replace file src/App.tsx dengan yang dari folder ini
3. Pastikan package.json ada lucide-react
4. Commit -> Vercel auto deploy
5. Test di vercel.app -> harusnya no "tidak dapat diinstal" lagi karena udah ada icon handling + drawer
6. Rebuild APK di pwabuilder.com -> akan tetap 2.1mb tapi UI baru

## Untuk build PWA icon fix

Tambah di public/:
- icon-192.png
- icon-512.png
- manifest.json dengan icons array

Sudah include di App.tsx tidak perlu install prompt manual.

Voice Chat Meta AI:
- Klik Chat Meta AI di drawer
- Klik 🎤 untuk ngomong
- Klik 🔊 untuk toggle suara AI

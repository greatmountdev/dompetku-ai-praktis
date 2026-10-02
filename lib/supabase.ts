
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
// Tables needed in Supabase:
// - users: id, email, nickname, pattern, tanggungan (json), created_at
// - wallets: id, user_id, group_type (tabungan/saku/pengeluaran/cicilan/darurat), name, bank, no_rek (encrypted), saldo, color
// - transactions: id, user_id, wallet_id, type (masuk/keluar), amount, desc, photo_url, sisa, created_at
// - storage bucket: dompetku-photos

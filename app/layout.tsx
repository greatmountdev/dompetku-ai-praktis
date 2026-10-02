import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DompetKu AI',
  description: 'APK Google - Daftar langsung ada isinya, praktis!',
  manifest: '/manifest.json',
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="id"><body>{children}</body></html>
}

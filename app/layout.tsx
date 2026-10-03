import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DompetKu AI',
  description: 'APK Google - Daftar langsung ada isinya, praktis!',
  manifest: '/manifest.json',
  themeColor: '#7C3AED',
}

export const viewport = {
  themeColor: '#7C3AED',
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-512.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}

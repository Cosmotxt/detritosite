import type { Metadata } from 'next'
import './globals.css'
import { pixelify } from './fonts'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Detrito Espacial',
  description: 'Site Oficial do Detrito Espacial',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" className={pixelify.variable}> 
      <body>
        <Header />
        <body>{children}</body>
        <Footer />
      </body>
    </html>
  )
}

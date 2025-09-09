import type { Metadata } from 'next'
import './globals.css'
import { syneMono } from './fonts'
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
    <html lang="pt-br" className={syneMono.variable}> 
      <body>
        <Header />
        <body className='font-syneMono'>{children}</body>
        <Footer />
      </body>
    </html>
  )
}

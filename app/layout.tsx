import React from "react"
import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: 'APYME Chile — Asociación de Pequeños y Microempresarios',
  description: 'Gremio dedicado a la defensa, representación y reactivación de los emprendedores y empresas de menor tamaño en Chile. Únete a APYME.',
  keywords: ['APYME', 'PYME', 'Emprendimiento', 'Gremio', 'Chile', 'Empresarios', 'Microempresas', 'Jorge Peña'],
  authors: [{ name: 'APYME Chile' }],
  openGraph: {
    title: 'APYME Chile — La Voz de los Pequeños Empresarios',
    description: 'Defensa, representación y reactivación de los emprendedores en Chile.',
    type: 'website',
    url: 'https://apymechile.cl',
    siteName: 'APYME Chile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'APYME Chile',
    description: 'La Voz de los Pequeños Empresarios de Chile.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${outfit.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

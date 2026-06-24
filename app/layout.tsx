import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spilrix Distribution',
  description:
    'Spilrix Distribution — independent release distribution for serious artists. Submit, track, and manage your catalog.',
}

export const viewport: Viewport = {
  themeColor: '#0a0908',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/*
          Fonts are loaded via a stylesheet link rather than next/font/google
          on purpose: it keeps font loading a pure runtime/browser concern,
          with zero impact on build-time network requirements. Swap in
          next/font/google any time for self-hosted, zero-request fonts.
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void font-body text-ivory antialiased">
        {children}
      </body>
    </html>
  )
}

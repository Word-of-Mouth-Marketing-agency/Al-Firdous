import type { Metadata } from 'next'
import { Noto_Sans_Arabic } from 'next/font/google'
import React from 'react'

import { createPageMetadata } from '@/lib/seo'

import './styles.css'

const arabicFont = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
})

export const metadata: Metadata = createPageMetadata({
  title: 'الفردوس',
  description: 'شركة الفردوس متخصصة في توفير قطع غيار المضخات وخلاطات ومحطات الخرسانة.',
  path: '/',
})

export default function FrontendLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${arabicFont.variable} bg-surface text-foreground antialiased`}>
        {props.children}
      </body>
    </html>
  )
}

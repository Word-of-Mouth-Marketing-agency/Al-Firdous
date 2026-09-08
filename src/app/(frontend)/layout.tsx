import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import React from 'react'

import { FloatingWhatsApp } from '@/components/site/FloatingWhatsApp'
import { getSiteSettings } from '@/lib/homepage-data'
import { createPageMetadata } from '@/lib/seo'

import './styles.css'

const arabicFont = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-arabic',
  display: 'swap',
})

export const metadata: Metadata = createPageMetadata({
  title: 'الفردوس',
  description: 'شركة الفردوس متخصصة في توفير قطع غيار المضخات وخلاطات ومحطات الخرسانة.',
  path: '/',
})

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings()

  return (
    <html lang="ar" dir="rtl">
      <body className={`${arabicFont.variable} bg-surface text-foreground antialiased`}>
        {props.children}
        <FloatingWhatsApp whatsappUrl={siteSettings.whatsappUrl} />
      </body>
    </html>
  )
}

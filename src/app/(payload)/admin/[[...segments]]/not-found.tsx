/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import { isVercelClientPreview } from '@/lib/preview-mode'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> => {
  if (isVercelClientPreview()) {
    return Promise.resolve({
      title: 'لوحة الإدارة غير متاحة في نسخة معاينة العميل',
      robots: { index: false, follow: false },
    })
  }

  return generatePageMetadata({ config, params, searchParams })
}

const NotFound = ({ params, searchParams }: Args) => {
  if (isVercelClientPreview()) {
    return (
      <main dir="rtl" style={{ padding: '3rem', fontFamily: 'sans-serif' }}>
        <h1>لوحة الإدارة غير متاحة في نسخة معاينة العميل</h1>
        <p>هذه النسخة مخصصة لمراجعة واجهة الموقع فقط.</p>
      </main>
    )
  }

  return NotFoundPage({ config, params, searchParams, importMap })
}

export default NotFound

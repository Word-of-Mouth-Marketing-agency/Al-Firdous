/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import { isVercelClientPreview } from '@/lib/preview-mode'
import { notFound } from 'next/navigation'

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

const Page = ({ params, searchParams }: Args) => {
  if (isVercelClientPreview()) notFound()
  return RootPage({ config, params, searchParams, importMap })
}

export default Page

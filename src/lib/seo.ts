import type { Metadata } from 'next'

import { isProductionRuntime } from '@/lib/production-environment'

const fallbackSiteUrl = 'http://localhost:3000'
const companyName = 'الفردوس'
const defaultDescription = 'شركة الفردوس متخصصة في توفير قطع غيار المضخات وخلاطات ومحطات الخرسانة.'

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (isProductionRuntime() && !configuredUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL is required in production')
  }

  try {
    const siteUrl = new URL(configuredUrl || fallbackSiteUrl)
    if (
      isProductionRuntime() &&
      (siteUrl.protocol !== 'https:' || ['localhost', '127.0.0.1', '::1'].includes(siteUrl.hostname.toLowerCase()))
    ) {
      throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS and a non-local hostname in production')
    }
    return siteUrl
  } catch {
    if (isProductionRuntime()) {
      throw new Error('NEXT_PUBLIC_SITE_URL must be a valid URL in production')
    }
    return new URL(fallbackSiteUrl)
  }
}

export function createPageMetadata({
  title,
  description = defaultDescription,
  path,
  image,
}: {
  title: string
  description?: string
  path: string
  image?: string | null
}): Metadata {
  const fullTitle = title === companyName ? title : `${title} | ${companyName}`
  const url = new URL(path, getSiteUrl())

  return {
    metadataBase: getSiteUrl(),
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: companyName,
      locale: 'ar_EG',
      type: 'website',
      images: image ? [new URL(image, getSiteUrl())] : undefined,
    },
  }
}

export function createProductMetadata({
  name,
  description,
  slug,
  image,
}: {
  name: string
  description?: string | null
  slug: string
  image?: string | null
}): Metadata {
  return createPageMetadata({
    title: name,
    description: description || defaultDescription,
    path: `/products/${slug}`,
    image,
  })
}

export function createCategoryMetadata({
  title,
  description,
  slug,
}: {
  title: string
  description?: string | null
  slug: string
}): Metadata {
  return createPageMetadata({
    title,
    description: description || defaultDescription,
    path: `/products/categories/${slug}`,
  })
}

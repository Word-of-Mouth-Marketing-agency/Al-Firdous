import type { Metadata } from 'next'

import { isProductionRuntime } from '@/lib/production-environment'
import { isVercelClientPreview } from '@/lib/preview-mode'

const fallbackSiteUrl = 'http://localhost:3000'
const companyName = 'الفردوس'
const defaultDescription = 'شركة الفردوس متخصصة في توفير قطع غيار المضخات وخلاطات ومحطات الخرسانة.'

export function getSiteUrl(environment: NodeJS.ProcessEnv = process.env): URL {
  const vercelPreview = isVercelClientPreview(environment)
  const configuredUrl = environment.NEXT_PUBLIC_SITE_URL?.trim()

  if (vercelPreview) {
    const vercelHost = environment.VERCEL_URL?.trim()

    if (!vercelHost) {
      if (environment.NODE_ENV === 'production') {
        throw new Error('VERCEL_URL is required for Vercel client preview metadata')
      }
    } else {
      try {
        const previewUrl = new URL(
          vercelHost.includes('://') ? vercelHost : `https://${vercelHost}`,
        )
        if (
          previewUrl.protocol !== 'https:' ||
          ['localhost', '127.0.0.1', '::1'].includes(previewUrl.hostname.toLowerCase())
        ) {
          throw new Error('VERCEL_URL must resolve to a public HTTPS hostname')
        }
        return previewUrl
      } catch {
        throw new Error('VERCEL_URL must be a valid public hostname for client preview metadata')
      }
    }
  }

  if (isProductionRuntime(environment) && !configuredUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL is required in production')
  }

  try {
    const siteUrl = new URL(configuredUrl || fallbackSiteUrl)
    if (
      isProductionRuntime(environment) &&
      (siteUrl.protocol !== 'https:' || ['localhost', '127.0.0.1', '::1'].includes(siteUrl.hostname.toLowerCase()))
    ) {
      throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS and a non-local hostname in production')
    }
    return siteUrl
  } catch {
    if (isProductionRuntime(environment)) {
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
    robots: isVercelClientPreview() ? { index: false, follow: false } : undefined,
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

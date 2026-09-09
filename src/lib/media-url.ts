import { getSiteUrl } from '@/lib/seo'

export function normalizeMediaUrl(src: string | null | undefined) {
  if (!src) return undefined

  try {
    const url = new URL(src)
    const siteUrl = getSiteUrl()

    if (url.origin === siteUrl.origin || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return `${url.pathname}${url.search}`
    }
  } catch {
    // Relative paths are already valid Next Image sources.
  }

  return src
}

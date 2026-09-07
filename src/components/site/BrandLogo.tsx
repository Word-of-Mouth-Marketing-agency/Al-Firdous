import Image from 'next/image'

import type { Media } from '@/payload-types'

type BrandLogoProps = {
  logo?: Media | null
  inverted?: boolean
}

export function BrandLogo({ logo, inverted = false }: BrandLogoProps) {
  if (logo?.url) {
    return (
      <Image
        src={logo.url}
        alt="الفردوس"
        width={logo.width || 180}
        height={logo.height || 64}
        className="site-logo-image"
      />
    )
  }

  return (
    <span className={`brand-lockup${inverted ? ' brand-lockup--inverted' : ''}`}>
      <span className="brand-lockup__mark" aria-hidden="true">
        <span />
      </span>
      <span className="brand-lockup__copy">
        <strong>الفردوس</strong>
        <small>قطع غيار معدات الخرسانة</small>
      </span>
    </span>
  )
}

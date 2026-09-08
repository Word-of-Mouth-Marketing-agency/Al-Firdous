import Image from 'next/image'

import type { Media } from '@/payload-types'

type MediaFrameProps = {
  media?: Media | null
  fallbackSrc?: string
  alt: string
  label: string
  className?: string
  sizes?: string
  objectPosition?: string
}

export function MediaFrame({
  media,
  fallbackSrc,
  alt,
  label,
  className = '',
  sizes = '100vw',
  objectPosition,
}: MediaFrameProps) {
  const src = media?.url || fallbackSrc

  if (src) {
    return (
      <div className={`media-frame ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
    )
  }

  return (
    <div className={`media-frame media-frame--empty ${className}`} role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  )
}

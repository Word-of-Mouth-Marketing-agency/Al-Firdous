import Image from 'next/image'

import type { Media } from '@/payload-types'

type MediaFrameProps = {
  media?: Media | null
  alt: string
  label: string
  className?: string
  priority?: boolean
  sizes?: string
}

export function MediaFrame({
  media,
  alt,
  label,
  className = '',
  priority = false,
  sizes = '100vw',
}: MediaFrameProps) {
  if (media?.url) {
    return (
      <div className={`media-frame ${className}`}>
        <Image
          src={media.url}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
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

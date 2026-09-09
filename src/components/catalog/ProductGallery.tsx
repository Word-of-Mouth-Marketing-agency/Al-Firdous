'use client'

import Image from 'next/image'
import { useState } from 'react'

import { normalizeMediaUrl } from '@/lib/media-url'

type GalleryImage = { src: string; alt: string }

export function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState(0)
  const active = images[selected] ?? images[0]

  if (!active) {
    return <div className="product-detail-gallery product-detail-gallery--empty">لا توجد صورة متاحة لهذه القطعة حالياً.</div>
  }

  return (
    <div className="product-detail-gallery">
      <div className="product-detail-gallery__main">
        <Image src={normalizeMediaUrl(active.src) || active.src} alt={active.alt} fill sizes="(min-width: 900px) 52vw, 92vw" priority={selected === 0} className="object-contain" />
      </div>
      {images.length > 1 ? (
        <div className="product-detail-gallery__thumbs" aria-label="صور المنتج">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={index === selected ? 'is-selected' : ''}
              aria-label={`عرض الصورة ${index + 1}`}
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
            >
              <Image src={normalizeMediaUrl(image.src) || image.src} alt="" fill sizes="80px" className="object-contain" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

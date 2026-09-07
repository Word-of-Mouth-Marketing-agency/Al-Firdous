import Link from 'next/link'

import { MediaFrame } from '@/components/site/MediaFrame'
import type { Media } from '@/payload-types'

type AboutPreviewProps = {
  media?: Media | null
}

export function AboutPreview({ media }: AboutPreviewProps) {
  return (
    <section className="section section--about" aria-labelledby="about-preview-title">
      <div className="site-container about-preview__grid">
        <MediaFrame
          media={media}
          alt="قطع غيار معدات الخرسانة"
          label="صورة تعريفية ستضاف من لوحة التحكم"
          className="about-preview__media"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <div className="about-preview__copy">
          <p className="section-kicker">من نحن</p>
          <h2 id="about-preview-title">الفردوس لقطع غيار معدات الخرسانة</h2>
          <p>
            شركة الفردوس متخصصة في توفير قطع غيار المضخات وخلاطات ومحطات الخرسانة مع الجودة وسرعة
            التوصيل.
          </p>
          <Link href="/about" className="button button--secondary">
            اعرف المزيد
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

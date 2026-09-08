import Link from 'next/link'
import { ArrowLeft, Gear, Medal, Truck } from '@phosphor-icons/react/dist/ssr'

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
          fallbackSrc="/images/home/about-parts.webp"
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
          <Link href="/about" className="about-preview__link">
            اعرف المزيد
            <ArrowLeft aria-hidden="true" weight="bold" />
          </Link>
          <div className="about-preview__features" aria-label="مميزات الفردوس">
            <div>
              <Gear aria-hidden="true" weight="regular" />
              <strong>توفير متخصص</strong>
              <span>لقطع غيار معدات الخرسانة</span>
            </div>
            <div>
              <Medal aria-hidden="true" weight="regular" />
              <strong>جودة عالية</strong>
              <span>في اختيار قطع الغيار</span>
            </div>
            <div>
              <Truck aria-hidden="true" weight="regular" />
              <strong>توصيل سريع</strong>
              <span>للوصول إلى احتياجاتك</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

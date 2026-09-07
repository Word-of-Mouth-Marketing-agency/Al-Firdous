import Link from 'next/link'

import { MediaFrame } from '@/components/site/MediaFrame'
import type { Media } from '@/payload-types'

type HeroProps = {
  media?: Media | null
}

export function Hero({ media }: HeroProps) {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="site-container hero-section__grid">
        <div className="hero-section__copy">
          <p className="hero-section__eyebrow">قطع غيار معدات الخرسانة</p>
          <h1 id="hero-title">
            كل ما تحتاجه من قطع غيار الخرسانة
            <br className="hero-section__desktop-break" />
            {' '}في مكان واحد
          </h1>
          <p className="hero-section__support">قطع غيار أصلية • جودة عالية • توصيل سريع</p>
          <div className="hero-section__actions">
            <Link href="/products" className="button button--primary">
              تصفح المنتجات
              <span aria-hidden="true">←</span>
            </Link>
            <Link href="/contact" className="button button--secondary">
              تواصل معنا
            </Link>
          </div>
        </div>

        <MediaFrame
          media={media}
          alt="معدات وقطع غيار الخرسانة"
          label="الصورة الرئيسية ستضاف من لوحة التحكم"
          className="hero-section__media"
          priority
          sizes="(min-width: 1024px) 52vw, 100vw"
        />
      </div>
    </section>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, WhatsappLogo } from '@phosphor-icons/react/dist/ssr'

export function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <Image
        src="/images/home/hero-industrial.webp"
        alt="محطة خرسانة وشاحنة خلاطة وقطع غيار لمعدات الخرسانة"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="hero-section__image"
      />
      <div className="hero-section__veil" aria-hidden="true" />
      <div className="site-container hero-section__inner">
        <div className="hero-section__copy">
          <h1 id="hero-title">
            كل ما تحتاجه من قطع غيار الخرسانة
            <br />
            في مكان واحد
          </h1>
          <p className="hero-section__support">قطع غيار أصلية • جودة عالية • توصيل سريع</p>
          <div className="hero-section__actions">
            <Link href="/products" className="button button--primary">
              تصفح المنتجات
              <ArrowLeft aria-hidden="true" weight="bold" />
            </Link>
            <Link href="/contact" className="button button--secondary">
              تواصل معنا
              <WhatsappLogo aria-hidden="true" weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

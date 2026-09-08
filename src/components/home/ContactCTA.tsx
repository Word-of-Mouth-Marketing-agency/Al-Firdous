import Image from 'next/image'
import Link from 'next/link'
import { Phone, WhatsappLogo } from '@phosphor-icons/react/dist/ssr'

import type { HomepageSiteSettings } from '@/lib/homepage-data'

type ContactCTAProps = {
  settings: HomepageSiteSettings
}

export function ContactCTA({ settings }: ContactCTAProps) {
  const phoneHref = settings.primaryPhone ? `tel:${settings.primaryPhone}` : '/contact'

  return (
    <section className="contact-cta" aria-labelledby="contact-cta-title">
      <div className="site-container contact-cta__inner">
        <Image
          src="/images/home/hero-industrial.webp"
          alt=""
          fill
          sizes="(min-width: 1200px) 1180px, 100vw"
          className="contact-cta__image"
        />
        <div className="contact-cta__content">
          <h2 id="contact-cta-title">هل تبحث عن قطعة غيار معينة؟</h2>
          <p>تواصل معنا الآن وسنساعدك في الوصول إلى القطعة المناسبة</p>
          <div className="contact-cta__actions">
            <a
              href={settings.whatsappUrl || '/contact'}
              className="button button--whatsapp"
              target={settings.whatsappUrl ? '_blank' : undefined}
              rel={settings.whatsappUrl ? 'noreferrer' : undefined}
            >
              <WhatsappLogo aria-hidden="true" weight="bold" />
              تواصل عبر واتساب
            </a>
            <Link href={phoneHref} className="button button--light">
              <Phone aria-hidden="true" weight="bold" />
              اتصل بنا
            </Link>
          </div>
        </div>
        <p className="contact-cta__note" aria-hidden="true">
          معًا لاستمرارية أفضل
        </p>
      </div>
    </section>
  )
}

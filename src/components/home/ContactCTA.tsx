import Link from 'next/link'

import type { HomepageSiteSettings } from '@/lib/homepage-data'

type ContactCTAProps = {
  settings: HomepageSiteSettings
}

export function ContactCTA({ settings }: ContactCTAProps) {
  const phoneHref = settings.primaryPhone ? `tel:${settings.primaryPhone}` : '/contact'

  return (
    <section className="contact-cta" aria-labelledby="contact-cta-title">
      <div className="site-container contact-cta__inner">
        <div>
          <h2 id="contact-cta-title">هل تبحث عن قطعة غيار معينة؟</h2>
          <p>تواصل معنا الآن وسنساعدك في الوصول إلى القطعة المناسبة</p>
        </div>
        <div className="contact-cta__actions">
          <a
            href={settings.whatsappUrl || '/contact'}
            className="button button--whatsapp"
            target={settings.whatsappUrl ? '_blank' : undefined}
            rel={settings.whatsappUrl ? 'noreferrer' : undefined}
          >
            تواصل عبر واتساب
          </a>
          <Link href={phoneHref} className="button button--light">
            اتصل بنا
          </Link>
        </div>
      </div>
    </section>
  )
}

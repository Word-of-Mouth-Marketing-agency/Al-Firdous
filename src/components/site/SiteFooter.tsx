import Link from 'next/link'
import { FacebookLogo, InstagramLogo, MapPin, TiktokLogo, WhatsappLogo } from '@phosphor-icons/react/dist/ssr'

import { BrandLogo } from '@/components/site/BrandLogo'
import { mainNavigation } from '@/lib/site-navigation'
import type { HomepageSiteSettings } from '@/lib/homepage-data'

type SiteFooterProps = {
  settings: HomepageSiteSettings
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const socialLinks = [
    { label: 'Facebook', href: settings.socialLinks.facebook, icon: FacebookLogo },
    { label: 'Instagram', href: settings.socialLinks.instagram, icon: InstagramLogo },
    { label: 'TikTok', href: settings.socialLinks.tiktok, icon: TiktokLogo },
  ].filter((social) => social.href)

  return (
    <footer className="site-footer">
      <div className="site-container site-footer__main">
        <section className="site-footer__brand" aria-label="عن الفردوس">
          <BrandLogo inverted />
          <p className="site-footer__description">
            شركة الفردوس متخصصة في توفير قطع غيار مضخات وخلاطات ومحطات الخرسانة بجودة عالية وسرعة في التوصيل.
          </p>
        </section>

        <nav className="site-footer__links" aria-label="روابط التذييل">
          <h2>روابط سريعة</h2>
          <ul>
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className="site-footer__contact" aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">تواصل معنا</h2>
          <div className="site-footer__contact-list">
            {settings.address ? (
              <p className="site-footer__contact-item">
                <MapPin aria-hidden="true" weight="bold" />
                <span>
                  <strong>العنوان</strong>
                  {settings.address}
                </span>
              </p>
            ) : null}
            {settings.primaryPhone && settings.whatsappUrl ? (
              <a href={settings.whatsappUrl} className="site-footer__contact-item site-footer__whatsapp" aria-label="التواصل عبر واتساب">
                <WhatsappLogo aria-hidden="true" weight="fill" />
                <span>
                  <strong>واتساب</strong>
                  <bdi>{settings.primaryPhone}</bdi>
                </span>
              </a>
            ) : null}
          </div>
        </section>
      </div>

      <div className="site-container site-footer__bottom">
        <p className="site-footer__copyright">جميع الحقوق محفوظة © الفردوس</p>
        <nav className="site-footer__social-nav" aria-label="التواصل الاجتماعي">
          <div className="site-footer__social-list">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href || undefined}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                >
                  <Icon aria-hidden="true" weight="fill" />
                </a>
              )
            })}
          </div>
        </nav>
      </div>
    </footer>
  )
}

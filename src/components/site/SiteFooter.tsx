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
      <div className="site-container site-footer__grid">
        <div className="site-footer__brand">
          <BrandLogo inverted />
          <div className="site-footer__contact" aria-label="بيانات التواصل">
            {settings.address ? (
              <p>
                <MapPin aria-hidden="true" weight="bold" />
                <span>
                  <strong>العنوان</strong>
                  {settings.address}
                </span>
              </p>
            ) : null}
            {settings.primaryPhone && settings.whatsappUrl ? (
              <a href={settings.whatsappUrl} className="site-footer__whatsapp" aria-label="التواصل عبر واتساب">
                <WhatsappLogo aria-hidden="true" weight="fill" />
                <span>
                  <strong>واتساب</strong>
                  <bdi>{settings.primaryPhone}</bdi>
                </span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="site-footer__links">
          <h2>روابط سريعة</h2>
          <nav aria-label="روابط التذييل">
            {mainNavigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="site-footer__socials">
          <h2>تابعونا على</h2>
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
          <p>جميع الحقوق محفوظة © الفردوس 2026</p>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import { FacebookLogo, InstagramLogo, TiktokLogo } from '@phosphor-icons/react/dist/ssr'

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

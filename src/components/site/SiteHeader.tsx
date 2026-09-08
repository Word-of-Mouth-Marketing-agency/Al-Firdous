import Link from 'next/link'
import { Phone } from '@phosphor-icons/react/dist/ssr'

import { BrandLogo } from '@/components/site/BrandLogo'
import { MobileDrawer } from '@/components/site/MobileDrawer'
import type { HomepageSiteSettings } from '@/lib/homepage-data'
import { mainNavigation } from '@/lib/site-navigation'

type SiteHeaderProps = {
  settings: HomepageSiteSettings
  activePath?: string
}

export function SiteHeader({ settings, activePath = '/' }: SiteHeaderProps) {
  const isActive = (href: string) => href === activePath
  const phoneHref = settings.primaryPhone ? `tel:${settings.primaryPhone}` : '/contact'

  return (
    <header className="site-header" aria-label={settings.companyName}>
      <div className="site-container site-header__inner">
        <Link href="/" className="site-header__brand">
          <BrandLogo />
        </Link>

        <nav className="site-header__desktop-nav" aria-label="التنقل الرئيسي">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`site-nav-link${isActive(item.href) ? ' site-nav-link--active' : ''}`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a href={phoneHref} className="button button--secondary site-header__cta">
          <Phone aria-hidden="true" weight="bold" />
          اتصل بنا
        </a>

        <MobileDrawer activePath={activePath} phoneHref={phoneHref} />
      </div>
    </header>
  )
}

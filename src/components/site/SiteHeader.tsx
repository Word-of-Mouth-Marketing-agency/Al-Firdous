import Link from 'next/link'

import { BrandLogo } from '@/components/site/BrandLogo'
import { mainNavigation } from '@/lib/site-navigation'
import type { Media } from '@/payload-types'

type SiteHeaderProps = {
  logo?: Media | null
}

export function SiteHeader({ logo }: SiteHeaderProps) {
  const isActive = (href: string) => href === '/'

  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <Link href="/" className="site-header__brand">
          <BrandLogo logo={logo} />
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

        <details className="site-header__mobile-menu">
          <summary className="site-header__menu-button">
            <span>القائمة</span>
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </summary>

          <nav id="mobile-navigation" className="site-header__mobile-nav" aria-label="التنقل الرئيسي">
            <div className="site-container site-header__mobile-nav-inner">
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
            </div>
          </nav>
        </details>
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { Phone, X } from '@phosphor-icons/react/dist/ssr'
import { useEffect, useRef, useState } from 'react'

import { BrandLogo } from '@/components/site/BrandLogo'
import { mainNavigation } from '@/lib/site-navigation'

type MobileDrawerProps = {
  activePath: string
  phoneHref: string
}

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function MobileDrawer({ activePath, phoneHref }: MobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)

  const isActive = (href: string) => href === activePath

  const closeDrawer = () => {
    setIsOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => drawerRef.current?.querySelector<HTMLElement>('[data-drawer-close]')?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeDrawer()
        return
      }

      if (event.key !== 'Tab' || !drawerRef.current) return

      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(focusableSelector))
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  return (
    <div className="site-header__mobile-menu">
      <button
        ref={triggerRef}
        type="button"
        className="site-header__menu-button"
        aria-label="القائمة"
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span className="visually-hidden">القائمة</span>
        <span className="menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <button
        type="button"
        className={isOpen ? 'mobile-drawer__backdrop is-open' : 'mobile-drawer__backdrop'}
        aria-label="إغلاق القائمة"
        aria-hidden={!isOpen}
        tabIndex={-1}
        inert={!isOpen}
        onClick={closeDrawer}
      />

      <aside
        ref={drawerRef}
        id="mobile-navigation"
        className={isOpen ? 'mobile-drawer is-open' : 'mobile-drawer'}
        aria-hidden={!isOpen}
        aria-labelledby="mobile-navigation-title"
        inert={!isOpen}
      >
        <div className="mobile-drawer__header">
          <Link href="/" className="mobile-drawer__brand" onClick={closeDrawer}>
            <BrandLogo />
          </Link>
          <button
            type="button"
            className="mobile-drawer__close"
            aria-label="إغلاق القائمة"
            data-drawer-close
            onClick={closeDrawer}
          >
            <X aria-hidden="true" weight="bold" />
          </button>
        </div>

        <h2 id="mobile-navigation-title" className="visually-hidden">القائمة الرئيسية</h2>

        <nav className="mobile-drawer__nav" aria-label="التنقل الرئيسي">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? 'mobile-drawer__nav-link is-active' : 'mobile-drawer__nav-link'}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={closeDrawer}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a href={phoneHref} className="button button--secondary mobile-drawer__cta" onClick={closeDrawer}>
          <Phone aria-hidden="true" weight="bold" />
          اتصل بنا
        </a>
      </aside>
    </div>
  )
}

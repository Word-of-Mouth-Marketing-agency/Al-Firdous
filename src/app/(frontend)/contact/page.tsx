import type { Metadata } from 'next'
import { FacebookLogo, InstagramLogo, MapPin, Phone, TiktokLogo, WhatsappLogo } from '@phosphor-icons/react/dist/ssr'

import { SiteFooter } from '@/components/site/SiteFooter'
import { InquiryForm } from '@/components/contact/InquiryForm'
import { PageTitle } from '@/components/site/PageTitle'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getHomepageData } from '@/lib/homepage-data'
import { createPageMetadata } from '@/lib/seo'
import { toWhatsAppUrl } from '@/lib/whatsapp'

export const metadata: Metadata = createPageMetadata({
  title: 'تواصل معنا',
  description: 'تواصل مع فريق الفردوس للاستفسار عن قطع غيار معدات الخرسانة.',
  path: '/contact',
})

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const { siteSettings } = await getHomepageData()
  const socialLinks = [
    { label: 'Facebook', href: siteSettings.socialLinks.facebook, icon: FacebookLogo },
    { label: 'Instagram', href: siteSettings.socialLinks.instagram, icon: InstagramLogo },
    { label: 'TikTok', href: siteSettings.socialLinks.tiktok, icon: TiktokLogo },
  ].filter((item) => item.href)

  return (
    <>
      <SiteHeader settings={siteSettings} activePath="/contact" />
      <main className="public-page">
        <PageTitle title="تواصل معنا" className="page-title--compact" />
        <section className="public-section contact-page-section">
          <div className="site-container contact-page-grid">
            <div className="contact-page-lead">
              <p className="page-kicker">قنوات مباشرة</p>
              <h2>هل تبحث عن قطعة غيار معينة؟</h2>
              <p>تواصل معنا الآن وسنساعدك في الوصول إلى القطعة المناسبة.</p>
              {siteSettings.address ? (
                <div className="contact-page-address">
                  <MapPin aria-hidden="true" weight="bold" />
                  <div>
                    <strong>العنوان</strong>
                    <p>{siteSettings.address}</p>
                  </div>
                </div>
              ) : null}
              <div className="contact-page-actions">
                {siteSettings.whatsappUrl ? <a href={siteSettings.whatsappUrl} className="button button--whatsapp"><WhatsappLogo aria-hidden="true" weight="fill" /> تواصل عبر واتساب</a> : null}
                {siteSettings.primaryPhone ? <a href={`tel:${siteSettings.primaryPhone}`} className="button button--secondary"><Phone aria-hidden="true" weight="bold" /> اتصل بنا</a> : null}
              </div>
              <nav className="contact-page-socials" aria-label="التواصل الاجتماعي">
                {socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href || undefined} target="_blank" rel="noreferrer"><Icon aria-hidden="true" weight="fill" /> {label}</a>)}
              </nav>
            </div>
            <div className="contact-page-side">
              <InquiryForm />
            </div>
            <div className="contact-people-card">
              <div className="contact-people-card__heading">
                <p className="page-kicker">مساعدة مباشرة</p>
                <h2>فريق التواصل</h2>
              </div>
              <ul className="contact-people-list">
                {siteSettings.contacts.map((contact, index) => (
                  <li key={contact.phone} className={`contact-person${index === 0 ? ' contact-person--primary' : ''}`}>
                    <div className="contact-person__identity"><strong>{contact.name}</strong><span>{contact.role}</span></div>
                    <a className="contact-person__phone" href={`tel:${contact.phone}`}><bdi>{contact.phone}</bdi></a>
                    {toWhatsAppUrl(contact.phone) ? <a className="contact-person__whatsapp" href={toWhatsAppUrl(contact.phone) || undefined} aria-label={`واتساب ${contact.name}`}><WhatsappLogo aria-hidden="true" weight="fill" /></a> : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={siteSettings} />
    </>
  )
}

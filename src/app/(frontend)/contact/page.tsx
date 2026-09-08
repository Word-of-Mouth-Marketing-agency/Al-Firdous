import type { Metadata } from 'next'
import { FacebookLogo, InstagramLogo, Phone, TiktokLogo, WhatsappLogo } from '@phosphor-icons/react/dist/ssr'

import { SiteFooter } from '@/components/site/SiteFooter'
import { InquiryForm } from '@/components/contact/InquiryForm'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getHomepageData, toWhatsAppUrl } from '@/lib/homepage-data'
import { createPageMetadata } from '@/lib/seo'

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
        <section className="inner-page-hero inner-page-hero--compact">
          <div className="site-container"><p className="page-kicker">نحن هنا لمساعدتك</p><h1>تواصل معنا</h1><p>أرسل لنا اسم القطعة أو صورة لها، وسنساعدك في الوصول إلى الاستفسار المناسب.</p></div>
        </section>
        <section className="public-section contact-page-section">
          <div className="site-container contact-page-grid">
            <div className="contact-page-lead">
              <p className="page-kicker">قنوات مباشرة</p>
              <h2>هل تبحث عن قطعة غيار معينة؟</h2>
              <p>تواصل معنا الآن وسنساعدك في الوصول إلى القطعة المناسبة.</p>
              <div className="contact-page-actions">
                {siteSettings.whatsappUrl ? <a href={siteSettings.whatsappUrl} className="button button--whatsapp"><WhatsappLogo aria-hidden="true" weight="fill" /> تواصل عبر واتساب</a> : null}
                {siteSettings.primaryPhone ? <a href={`tel:${siteSettings.primaryPhone}`} className="button button--secondary"><Phone aria-hidden="true" weight="bold" /> اتصل بنا</a> : null}
              </div>
              <div className="contact-page-socials">{socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href || undefined} target="_blank" rel="noreferrer"><Icon aria-hidden="true" weight="fill" /> {label}</a>)}</div>
            </div>
            <div className="contact-page-side">
              <InquiryForm />
              <div className="contact-people-card">
                <h2>فريق التواصل</h2>
                <div className="contact-people-list">
                  {siteSettings.contacts.map((contact) => (
                    <div key={contact.phone} className="contact-person">
                      <div><strong>{contact.name}</strong><span>{contact.role}</span></div>
                      <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                      {toWhatsAppUrl(contact.phone) ? <a href={toWhatsAppUrl(contact.phone) || undefined} aria-label={`واتساب ${contact.name}`}><WhatsappLogo aria-hidden="true" weight="fill" /></a> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={siteSettings} />
    </>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Package, Truck } from '@phosphor-icons/react/dist/ssr'

import { SiteFooter } from '@/components/site/SiteFooter'
import { PageTitle } from '@/components/site/PageTitle'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getHomepageData } from '@/lib/homepage-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'من نحن',
  description: 'شركة الفردوس متخصصة في توفير قطع غيار المضخات وخلاطات ومحطات الخرسانة مع الجودة وسرعة التوصيل.',
  path: '/about',
})

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const { siteSettings } = await getHomepageData()

  return (
    <>
      <SiteHeader settings={siteSettings} activePath="/about" />
      <main className="public-page">
        <PageTitle title="من نحن" />
        <section className="public-section about-page-intro">
          <div className="site-container about-page-intro__grid">
            <div className="about-page-intro__image"><Image src="/images/home/about-parts.webp" alt="قطع غيار لمعدات الخرسانة" fill sizes="(min-width: 900px) 50vw, 92vw" className="object-cover" /></div>
            <div className="public-copy">
              <p className="page-kicker">نبذة عن الفردوس</p>
              <h2>قطع غيار لمعدات الخرسانة</h2>
              <p>شركة الفردوس متخصصة في توفير قطع غيار المضخات وخلاطات ومحطات الخرسانة مع الجودة وسرعة التوصيل.</p>
              <p>يمكنك استعراض القطع المتاحة أو التواصل معنا عند البحث عن قطعة محددة.</p>
              <Link href="/products" className="button button--primary">استعرض المنتجات <ArrowLeft aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
        <section className="public-section public-section--muted">
          <div className="site-container">
            <div className="section-heading section-heading--centered"><p className="page-kicker">مجالات القطع</p><h2>مجالات تخصصنا</h2></div>
            <div className="about-scope-grid">
              <div><Package aria-hidden="true" /><h3>مضخات الخرسانة</h3><p>قطع غيار متاحة ضمن الكتالوج الحالي.</p></div>
              <div><Truck aria-hidden="true" /><h3>خلاطات الخرسانة</h3><p>قسم مخصص للوصول إلى احتياجات الخلاطات.</p></div>
              <div><CheckCircle aria-hidden="true" /><h3>محطات الخرسانة</h3><p>قسم واضح لقطع غيار محطات الخرسانة.</p></div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={siteSettings} />
    </>
  )
}

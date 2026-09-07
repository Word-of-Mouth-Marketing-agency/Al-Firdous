import type { Metadata } from 'next'

import { AboutPreview } from '@/components/home/AboutPreview'
import { CategorySection } from '@/components/home/CategorySection'
import { ContactCTA } from '@/components/home/ContactCTA'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Hero } from '@/components/home/Hero'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { createPageMetadata } from '@/lib/seo'
import { getHomepageData } from '@/lib/homepage-data'

export const metadata: Metadata = createPageMetadata({
  title: 'الرئيسية',
  description: 'كل ما تحتاجه من قطع غيار الخرسانة في مكان واحد.',
  path: '/',
})

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { categories, featuredProducts, siteSettings } = await getHomepageData()

  return (
    <>
      <SiteHeader logo={siteSettings.logo} />
      <main>
        <Hero />
        <CategorySection categories={categories} />
        <AboutPreview />
        <FeaturedProducts products={featuredProducts} />
        <ContactCTA settings={siteSettings} />
      </main>
      <SiteFooter settings={siteSettings} />
    </>
  )
}

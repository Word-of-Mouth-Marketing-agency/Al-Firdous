import type { Metadata } from 'next'
import Link from 'next/link'

import { CatalogFilters } from '@/components/catalog/CatalogFilters'
import { CatalogProductCard } from '@/components/catalog/CatalogProductCard'
import { SiteFooter } from '@/components/site/SiteFooter'
import { PageTitle } from '@/components/site/PageTitle'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getCatalogData } from '@/lib/catalog-data'
import { getHomepageData } from '@/lib/homepage-data'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'المنتجات',
  description: 'استعرض قطع غيار مضخات وخلاطات ومحطات الخرسانة المتاحة للاستفسار.',
  path: '/products',
})

export const dynamic = 'force-dynamic'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const query = firstParam(params.q)
  const category = firstParam(params.category)
  const brand = firstParam(params.brand)
  const page = Number.parseInt(firstParam(params.page) || '1', 10) || 1
  const [{ siteSettings }, catalog] = await Promise.all([
    getHomepageData(),
    getCatalogData({ query, category, brand, page, limit: 24 }),
  ])

  return (
    <>
      <SiteHeader settings={siteSettings} activePath="/products" />
      <main className="public-page">
        <PageTitle title="المنتجات" />
        <section className="public-section public-section--muted products-page-section">
          <div className="site-container">
            <CatalogFilters query={catalog.query} category={catalog.category} brand={catalog.brand} categories={catalog.categories} brands={catalog.brands} />
            <div className="catalog-results-bar"><p>{catalog.totalDocs} قطعة متاحة للاستفسار</p>{catalog.contentSource === 'fallback' ? <span>معاينة محلية للوسائط المتاحة</span> : null}</div>
            {catalog.products.length ? (
              <div className="catalog-product-grid">{catalog.products.map((product) => <CatalogProductCard key={product.slug} product={product} />)}</div>
            ) : (
              <div className="catalog-empty-state"><h2>لم نعثر على منتجات مطابقة</h2><p>جرّب تغيير كلمة البحث أو اختيار تصنيف مختلف.</p><Link href="/products" className="button button--secondary">عرض كل المنتجات</Link></div>
            )}
            {catalog.totalPages > 1 ? (
              <nav className="catalog-pagination" aria-label="صفحات المنتجات">
                {catalog.page > 1 ? <Link href={`/products?${new URLSearchParams({ q: catalog.query, category: catalog.category, brand: catalog.brand, page: String(catalog.page - 1) })}`}>السابق</Link> : <span aria-disabled="true">السابق</span>}
                <strong>صفحة {catalog.page} من {catalog.totalPages}</strong>
                {catalog.page < catalog.totalPages ? <Link href={`/products?${new URLSearchParams({ q: catalog.query, category: catalog.category, brand: catalog.brand, page: String(catalog.page + 1) })}`}>التالي</Link> : <span aria-disabled="true">التالي</span>}
              </nav>
            ) : null}
          </div>
        </section>
      </main>
      <SiteFooter settings={siteSettings} />
    </>
  )
}

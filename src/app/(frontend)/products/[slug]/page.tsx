import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Phone, WhatsappLogo } from '@phosphor-icons/react/dist/ssr'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/catalog/Breadcrumbs'
import { CatalogProductCard } from '@/components/catalog/CatalogProductCard'
import { ProductGallery } from '@/components/catalog/ProductGallery'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getCatalogData, getCatalogProductBySlug } from '@/lib/catalog-data'
import { getHomepageData } from '@/lib/homepage-data'
import { createProductMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type ProductPageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getCatalogProductBySlug(slug)
  if (!product) return createProductMetadata({ name: 'منتج', slug })
  return createProductMetadata({ name: product.name, description: product.shortDescription, slug, image: product.image?.url || product.fallbackImageSrc })
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const [product, { siteSettings }, related] = await Promise.all([
    getCatalogProductBySlug(slug),
    getHomepageData(),
    getCatalogData({ category: 'concrete-pump-parts', limit: 6 }),
  ])

  if (!product) notFound()

  const images = [
    product.image?.url || product.fallbackImageSrc,
    ...product.gallery.map((media) => media.url).filter((src): src is string => Boolean(src)),
  ].filter((src): src is string => Boolean(src)).map((src) => ({ src, alt: product.name }))
  const inquiryText = encodeURIComponent(`مرحباً، أريد الاستفسار عن: ${product.name}`)
  const whatsappUrl = siteSettings.whatsappUrl ? `${siteSettings.whatsappUrl}?text=${inquiryText}` : null
  const relatedProducts = related.products.filter((item) => item.slug !== product.slug).slice(0, 4)

  return (
    <>
      <SiteHeader settings={siteSettings} activePath="/products" />
      <main className="public-page">
        <section className="product-detail-page public-section">
          <div className="site-container">
            <Breadcrumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'المنتجات', href: '/products' }, { label: product.name }]} />
            <div className="product-detail-grid">
              <ProductGallery images={images} />
              <article className="product-detail-copy">
                <p className="page-kicker">{product.category.title}</p>
                <h1>{product.name}</h1>
                {product.brand ? <p className="product-detail-brand">العلامة المدعومة: <strong>{product.brand.name}</strong></p> : null}
                <p className="product-detail-description">{product.shortDescription || 'قطعة من مجموعة قطع غيار معدات الخرسانة المتاحة للاستفسار.'}</p>
                <p className="product-detail-note">للتأكد من ملاءمة القطعة، أرسل صورة القطعة أو بيانات المعدة لفريق الفردوس قبل الاستفسار.</p>
                <div className="product-detail-actions">
                  {whatsappUrl ? <a href={whatsappUrl} className="button button--whatsapp"><WhatsappLogo aria-hidden="true" weight="fill" /> استفسر عبر واتساب</a> : null}
                  {siteSettings.primaryPhone ? <a href={`tel:${siteSettings.primaryPhone}`} className="button button--secondary"><Phone aria-hidden="true" weight="bold" /> اتصل بنا</a> : null}
                </div>
                <Link href="/products" className="text-link"><ArrowLeft aria-hidden="true" /> العودة إلى المنتجات</Link>
              </article>
            </div>
          </div>
        </section>
        {relatedProducts.length ? <section className="public-section public-section--muted"><div className="site-container"><div className="section-heading"><p className="page-kicker">من نفس القسم</p><h2>منتجات قد تهمك</h2></div><div className="catalog-product-grid catalog-product-grid--related">{relatedProducts.map((item) => <CatalogProductCard key={item.slug} product={item} />)}</div></div></section> : null}
      </main>
      <SiteFooter settings={siteSettings} />
    </>
  )
}

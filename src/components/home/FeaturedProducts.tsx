import Link from 'next/link'

import { MediaFrame } from '@/components/site/MediaFrame'
import type { Product } from '@/payload-types'

type FeaturedProductsProps = {
  products: Product[]
}

function ProductCard({ product }: { product: Product }) {
  const image = typeof product.mainImage === 'object' && product.mainImage ? product.mainImage : null

  return (
    <article className="product-card">
      <MediaFrame
        media={image}
        alt={product.name}
        label={`صورة ${product.name} ستضاف من لوحة التحكم`}
        className="product-card__media"
        sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
      />
      <div className="product-card__body">
        <h3>{product.name}</h3>
        {product.partNumber ? <p>{product.partNumber}</p> : null}
        <Link href={`/contact?product=${product.slug}`} className="product-card__action">
          استفسر الآن
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  )
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="section section--products" aria-labelledby="featured-products-title">
      <div className="site-container">
        <div className="section-heading section-heading--centered">
          <h2 id="featured-products-title">منتجات مميزة</h2>
          <p>منتجات مختارة من قطع غيار الخرسانة</p>
        </div>

        {products.length ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="content-empty-state">
            <p>ستظهر المنتجات المميزة هنا بعد نشرها من لوحة التحكم.</p>
            <Link href="/products" className="text-link">
              تصفح المنتجات
              <span aria-hidden="true">←</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

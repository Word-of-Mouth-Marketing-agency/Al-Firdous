import Link from 'next/link'
import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr'

import { MediaFrame } from '@/components/site/MediaFrame'
import type { HomepageProduct } from '@/lib/homepage-data'

type FeaturedProductsProps = {
  products: HomepageProduct[]
}

function ProductCard({ product }: { product: HomepageProduct }) {
  return (
    <article className="product-card">
      <MediaFrame
        media={product.image}
        fallbackSrc={product.fallbackImageSrc || undefined}
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
          <WhatsappLogo aria-hidden="true" weight="bold" />
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

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

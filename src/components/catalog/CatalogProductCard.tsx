import Link from 'next/link'
import { ArrowLeft, ChatCircleText } from '@phosphor-icons/react/dist/ssr'

import { MediaFrame } from '@/components/site/MediaFrame'
import type { CatalogProduct } from '@/lib/catalog-data'

export function CatalogProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="catalog-product-card">
      <Link href={`/products/${product.slug}`} className="catalog-product-card__media-link">
        <MediaFrame
          media={product.image}
          fallbackSrc={product.fallbackImageSrc ?? undefined}
          alt={product.name}
          label={product.name}
          className="catalog-product-card__media"
          sizes="(min-width: 1200px) 260px, (min-width: 768px) 31vw, 92vw"
        />
      </Link>
      <div className="catalog-product-card__body">
        <div>
          <p className="catalog-product-card__category">{product.category.title}</p>
          <h2>
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h2>
          {product.partNumber ? <p className="catalog-product-card__part">{product.partNumber}</p> : null}
        </div>
        <Link href={`/products/${product.slug}`} className="catalog-product-card__action">
          <ChatCircleText aria-hidden="true" weight="bold" />
          استفسر الآن
          <ArrowLeft aria-hidden="true" weight="bold" />
        </Link>
      </div>
    </article>
  )
}

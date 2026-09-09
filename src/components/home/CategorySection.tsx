import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Factory, Gear, Pipe, Truck } from '@phosphor-icons/react/dist/ssr'

import { MediaFrame } from '@/components/site/MediaFrame'
import type { HomepageCategory } from '@/lib/homepage-data'

type CategorySectionProps = {
  categories: HomepageCategory[]
}

const brandAssets = {
  zoomlion: { src: '/images/brands/zoomlion.svg', width: 92, height: 24 },
  schwing: { src: '/images/brands/schwing.svg', width: 88, height: 24 },
  putzmeister: { src: '/images/brands/putzmeister-optimized.png', width: 56, height: 28 },
} as const

export function CategorySection({ categories }: CategorySectionProps) {
  const icons = {
    'concrete-pump-parts': Pipe,
    'concrete-mixer-parts': Truck,
    'concrete-plant-parts': Factory,
    'general-parts': Gear,
  }

  return (
    <section className="section section--categories" aria-labelledby="categories-title">
      <div className="site-container">
        <div className="section-heading section-heading--centered">
          <h2 id="categories-title">تصنيفات المنتجات</h2>
          <p>اختر القسم المناسب لاحتياجاتك</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => {
            const Icon = icons[category.slug as keyof typeof icons] || Gear

            return (
              <article key={category.id} className="category-card">
                <MediaFrame
                  media={category.image}
                  fallbackSrc={category.fallbackImageSrc}
                  alt={category.title}
                  label={`صورة ${category.title} ستضاف من لوحة التحكم`}
                  className="category-card__media"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="category-card__body">
                  <span className="category-card__icon" aria-hidden="true">
                    <Icon weight="regular" />
                  </span>
                  <h3>{category.title}</h3>
                  {category.description ? <p>{category.description}</p> : null}
                  {category.brands.length ? (
                    <div
                      className="category-card__brands"
                      aria-label="علامات منتجات مضخات الخرسانة"
                    >
                      {category.brands.map((brand) => {
                        const asset = brandAssets[brand.slug as keyof typeof brandAssets]
                        if (!asset) return null

                        const brandQuery = new URLSearchParams({
                          category: category.slug,
                          brand: brand.slug,
                        }).toString()

                        return (
                          <Link
                            key={brand.slug}
                            href={`/products?${brandQuery}`}
                            className="category-card__brand-link"
                            aria-label={`عرض منتجات ${brand.name} لمضخات الخرسانة`}
                          >
                            <Image
                              src={asset.src}
                              alt=""
                              width={asset.width}
                              height={asset.height}
                              className="category-card__brand-logo"
                            />
                            <ArrowLeft aria-hidden="true" weight="bold" />
                          </Link>
                        )
                      })}
                    </div>
                  ) : null}
                  <Link href={`/products?category=${category.slug}`} className="text-link">
                    عرض المنتجات
                    <ArrowLeft aria-hidden="true" weight="bold" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

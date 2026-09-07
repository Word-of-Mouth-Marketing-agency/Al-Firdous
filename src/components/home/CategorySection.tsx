import Link from 'next/link'

import { MediaFrame } from '@/components/site/MediaFrame'
import type { HomepageCategory } from '@/lib/homepage-data'

type CategorySectionProps = {
  categories: HomepageCategory[]
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="section section--categories" aria-labelledby="categories-title">
      <div className="site-container">
        <div className="section-heading section-heading--centered">
          <h2 id="categories-title">تصنيفات المنتجات</h2>
          <p>اختر القسم المناسب لاحتياجاتك</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <article key={category.id} className="category-card">
              <MediaFrame
                media={category.image}
                alt={category.title}
                label={`صورة ${category.title} ستضاف من لوحة التحكم`}
                className="category-card__media"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="category-card__body">
                <h3>{category.title}</h3>
                {category.description ? <p>{category.description}</p> : null}
                {category.brandNames.length ? (
                  <div className="category-card__brands" aria-label="العلامات المرتبطة بفئة المضخات">
                    {category.brandNames.map((brandName) => (
                      <span key={brandName}>{brandName}</span>
                    ))}
                  </div>
                ) : null}
                <Link href={`/products?category=${category.slug}`} className="text-link">
                  عرض المنتجات
                  <span aria-hidden="true">←</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

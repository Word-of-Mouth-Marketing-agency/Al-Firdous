import Link from 'next/link'
import { MagnifyingGlass, X } from '@phosphor-icons/react/dist/ssr'

import type { CatalogBrand, CatalogCategory } from '@/lib/catalog-data'

type CatalogFiltersProps = {
  query: string
  category: string
  brand: string
  categories: CatalogCategory[]
  brands: CatalogBrand[]
}

export function CatalogFilters({ query, category, brand, categories, brands }: CatalogFiltersProps) {
  const hasFilters = Boolean(query || category || brand)

  return (
    <form className="catalog-filters" method="get" action="/products">
      <div className="catalog-filters__search">
        <label htmlFor="catalog-search">ابحث في المنتجات</label>
        <div className="catalog-search-control">
          <MagnifyingGlass aria-hidden="true" />
          <input id="catalog-search" name="q" type="search" defaultValue={query} placeholder="اكتب اسم القطعة" />
        </div>
      </div>
      <div className="catalog-filters__field">
        <label htmlFor="catalog-category">التصنيف</label>
        <select id="catalog-category" name="category" defaultValue={category}>
          <option value="">كل التصنيفات</option>
          {categories.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
        </select>
      </div>
      <div className="catalog-filters__field">
        <label htmlFor="catalog-brand">العلامة المدعومة</label>
        <select id="catalog-brand" name="brand" defaultValue={brand}>
          <option value="">كل العلامات</option>
          {brands.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
      </div>
      <button className="button button--primary catalog-filters__submit" type="submit">
        <MagnifyingGlass aria-hidden="true" weight="bold" />
        بحث
      </button>
      {hasFilters ? <Link href="/products" className="catalog-filters__reset"><X aria-hidden="true" /> مسح الفلاتر</Link> : null}
    </form>
  )
}

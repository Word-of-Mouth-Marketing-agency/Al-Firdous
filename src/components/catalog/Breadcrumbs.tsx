import Link from 'next/link'

type BreadcrumbItem = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumbs" aria-label="مسار الصفحة">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="breadcrumbs__item">
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}

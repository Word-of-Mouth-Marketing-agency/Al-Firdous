import { RouteShell } from '@/components/site/RouteShell'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({ title: 'المنتجات', path: '/products' })

export default function ProductsPage() {
  return <RouteShell title="المنتجات" />
}

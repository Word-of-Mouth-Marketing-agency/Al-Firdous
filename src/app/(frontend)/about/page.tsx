import { RouteShell } from '@/components/site/RouteShell'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({ title: 'من نحن', path: '/about' })

export default function AboutPage() {
  return <RouteShell title="من نحن" />
}

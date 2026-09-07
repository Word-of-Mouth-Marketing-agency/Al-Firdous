import { RouteShell } from '@/components/site/RouteShell'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({ title: 'تواصل معنا', path: '/contact' })

export default function ContactPage() {
  return <RouteShell title="تواصل معنا" />
}

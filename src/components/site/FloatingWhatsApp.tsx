import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr'

import { GENERAL_WHATSAPP_MESSAGE, withWhatsAppMessage } from '@/lib/whatsapp'

type FloatingWhatsAppProps = {
  whatsappUrl: string | null
}

export function FloatingWhatsApp({ whatsappUrl }: FloatingWhatsAppProps) {
  const href = withWhatsAppMessage(whatsappUrl, GENERAL_WHATSAPP_MESSAGE)

  if (!href) return null

  return (
    <a
      href={href}
      className="whatsapp-float"
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل معنا عبر واتساب"
    >
      <WhatsappLogo aria-hidden="true" weight="fill" />
      <span className="visually-hidden">تواصل معنا عبر واتساب</span>
    </a>
  )
}

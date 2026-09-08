export const PRIMARY_WHATSAPP_PHONE = '01031080031'
export const GENERAL_WHATSAPP_MESSAGE = 'مرحباً، أريد الاستفسار عن منتجات الفردوس.'

export function toWhatsAppUrl(phone: string | null | undefined) {
  if (!phone) return null

  const digits = phone.replace(/\D/g, '')
  if (!digits) return null

  const internationalNumber = digits.startsWith('0') ? `20${digits.slice(1)}` : digits
  return `https://wa.me/${internationalNumber}`
}

export function withWhatsAppMessage(url: string | null | undefined, message: string) {
  if (!url) return null

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}text=${encodeURIComponent(message)}`
}

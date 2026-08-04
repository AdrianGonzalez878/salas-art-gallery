const DEFAULT_WHATSAPP = '529515471306'

export function normalizeWhatsAppNumber(input?: string | null): string {
  const digits = (input?.trim() || DEFAULT_WHATSAPP).replace(/\D/g, '')
  return digits || DEFAULT_WHATSAPP
}

export function whatsappUrl(input?: string | null): string {
  return `https://wa.me/${normalizeWhatsAppNumber(input)}`
}

export function telUrl(input?: string | null): string {
  return `tel:+${normalizeWhatsAppNumber(input)}`
}

export function formatWhatsAppDisplay(input?: string | null): string {
  const digits = normalizeWhatsAppNumber(input)

  if (digits.startsWith('52') && digits.length === 12) {
    const local = digits.slice(2)
    return `+52 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`
  }

  return `+${digits}`
}

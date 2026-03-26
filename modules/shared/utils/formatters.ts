// modules/shared/utils/formatters.ts
// ─────────────────────────────────────────────────────────────────────────────
// Funciones puras de formato. Sin dependencias externas.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Edad ─────────────────────────────────────────────────────────────────────

/**
 * Convierte meses a texto legible.
 * formatAge(3)   → "3 meses"
 * formatAge(12)  → "1 año"
 * formatAge(30)  → "2 años 6 meses"
 * formatAge(96)  → "8 años"
 */
export function formatAge(months: number): string {
  if (months < 1)  return 'Recién nacido'
  if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'}`

  const years    = Math.floor(months / 12)
  const remMonths = months % 12

  if (remMonths === 0) return `${years} ${years === 1 ? 'año' : 'años'}`
  return `${years} ${years === 1 ? 'año' : 'años'} ${remMonths} ${remMonths === 1 ? 'mes' : 'meses'}`
}

/**
 * Versión corta para cards.
 * formatAgeShort(3)  → "3m"
 * formatAgeShort(14) → "1a 2m"
 * formatAgeShort(24) → "2a"
 */
export function formatAgeShort(months: number): string {
  if (months < 12) return `${months}m`
  const y = Math.floor(months / 12)
  const m = months % 12
  return m === 0 ? `${y}a` : `${y}a ${m}m`
}

// ─── Moneda ───────────────────────────────────────────────────────────────────

/**
 * formatCurrency(1500)   → "$1,500 MXN"
 * formatCurrency(250.50) → "$250.50 MXN"
 */
export function formatCurrency(amount: number, currency = 'MXN'): string {
  const formatted = new Intl.NumberFormat('es-MX', {
    style:                 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return `${formatted} ${currency}`
}

// ─── Fechas ───────────────────────────────────────────────────────────────────

/**
 * formatDate('2025-01-15') → "15 de enero de 2025"
 */
export function formatDate(iso: string): string {
  const date = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`)
  return date.toLocaleDateString('es-MX', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  })
}

/**
 * formatDateShort('2025-01-15') → "15 ene 2025"
 */
export function formatDateShort(iso: string): string {
  const date = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`)
  return date.toLocaleDateString('es-MX', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

/**
 * formatRelativeDate — fecha relativa al momento actual
 * formatRelativeDate('2025-01-22T10:00:00Z') → "hace 3 días"
 * Fallback a fecha corta si es > 30 días
 */
export function formatRelativeDate(iso: string): string {
  const now  = Date.now()
  const date = new Date(iso).getTime()
  const diff = now - date   // milisegundos

  const minutes = Math.floor(diff / 60_000)
  const hours   = Math.floor(diff / 3_600_000)
  const days    = Math.floor(diff / 86_400_000)

  if (minutes < 1)   return 'ahora mismo'
  if (minutes < 60)  return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
  if (hours   < 24)  return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
  if (days    < 7)   return `hace ${days} ${days === 1 ? 'día' : 'días'}`
  if (days    < 30)  return `hace ${Math.floor(days / 7)} sem.`

  return formatDateShort(iso)
}

// ─── Slugs ────────────────────────────────────────────────────────────────────

/**
 * toSlug('Labrador Golden Retriever') → 'labrador-golden-retriever'
 * toSlug('Niña Bella #1')             → 'nina-bella-1'
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // elimina acentos
    .replace(/[^a-z0-9\s-]/g, '')     // solo letras, números, espacios, guiones
    .trim()
    .replace(/\s+/g, '-')             // espacios → guiones
    .replace(/-+/g, '-')              // múltiples guiones → uno
}

// ─── Texto ────────────────────────────────────────────────────────────────────

export function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function titleCase(text: string): string {
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

// ─── Números ──────────────────────────────────────────────────────────────────

/**
 * formatNumber(1243)   → "1,243"
 * formatNumber(842000) → "842,000"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-MX').format(n)
}

/**
 * formatCompact(1243)   → "1.2K"
 * formatCompact(842000) → "842K"
 */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat('es-MX', { notation: 'compact' }).format(n)
}

/**
 * formatPercent(0.94) → "94%"
 * formatPercent(75)   → "75%"  (si ya viene como 0-100)
 */
export function formatPercent(value: number, isDecimal = false): string {
  const n = isDecimal ? value * 100 : value
  return `${Math.round(n)}%`
}

// ─── Peso ─────────────────────────────────────────────────────────────────────

/**
 * formatWeight(8.5) → "8.5 kg"
 * formatWeight(28)  → "28 kg"
 */
export function formatWeight(kg: number): string {
  return `${kg % 1 === 0 ? kg : kg.toFixed(1)} kg`
}

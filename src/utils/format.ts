import type { OrderStatus, SizeId } from '../types/index.ts'

const FA = '۰۱۲۳۴۵۶۷۸۹'
const AR = '٠١٢٣٤٥٦٧٨٩'

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function toFa(value: string | number) {
  return String(value).replace(/\d/g, (d) => FA[Number(d)] ?? d)
}

export function toEnDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)))
}

export function normalize(value: string) {
  return toEnDigits(value)
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function formatPrice(value: number) {
  const grouped = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
  return `${toFa(grouped)} تومان`
}

export function formatNumber(value: number) {
  return toFa(
    Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '٬'),
  )
}

export function compactToman(value: number) {
  if (value >= 1_000_000) {
    const million = value / 1_000_000
    const text = million >= 10 ? million.toFixed(0) : million.toFixed(1)
    return `${toFa(text)} میلیون`
  }
  return formatPrice(value)
}

export function normalizePhone(value: string) {
  let digits = toEnDigits(value).replace(/\D/g, '')
  if (digits.startsWith('98')) digits = `0${digits.slice(2)}`
  if (digits.length === 10 && digits.startsWith('9')) digits = `0${digits}`
  return digits
}

export function isMobile(value: string) {
  return /^09\d{9}$/.test(normalizePhone(value))
}

export function formatPhone(value: string) {
  const digits = normalizePhone(value)
  if (digits.length !== 11) return toFa(value)
  return toFa(`${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`)
}

export function formatLandline(value: string) {
  const digits = toEnDigits(value).replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('021')) {
    return toFa(`${digits.slice(0, 3)}-${digits.slice(3)}`)
  }
  return formatPhone(value)
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso))
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('fa-IR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatClock(iso: string) {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatDayKey(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  if (!year || !month || !day) return toFa(key)
  return new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function shiftDate(days: number, base = new Date()) {
  const next = new Date(base)
  next.setDate(next.getDate() + days)
  return next
}

export function isOpen(now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= 12 * 60 && mins < 23 * 60 + 30
}

export function asset(path: string) {
  if (path.startsWith('data:') || path.startsWith('blob:') || path.startsWith('http')) return path
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${path.replace(/^\//, '')}`
}

export function foodSrc(image: string) {
  if (!image) return ''
  if (image.startsWith('data:') || image.startsWith('blob:') || image.startsWith('http') || image.startsWith('/')) {
    return image.startsWith('/') ? asset(image) : image
  }
  return asset(`images/${image}`)
}

export function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export const SIZE_LABEL: Record<SizeId, string> = {
  small: 'کوچک',
  medium: 'متوسط',
  large: 'بزرگ',
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'جدید',
  confirmed: 'تأیید شده',
  preparing: 'در حال آماده‌سازی',
  ready: 'آماده تحویل',
  shipped: 'ارسال شده',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
}

export const PAY_LABEL = {
  online: 'پرداخت آنلاین',
  cash: 'پرداخت در محل',
} as const

export function trackIndex(status: OrderStatus) {
  if (status === 'new') return 0
  if (status === 'confirmed') return 1
  if (status === 'preparing' || status === 'ready') return 2
  if (status === 'shipped') return 3
  if (status === 'completed') return 4
  return -1
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

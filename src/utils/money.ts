import { addonsFor, COUPONS, OFFER_RATE, SIZES } from '../data/catalog.ts'
import type { Settings, SizeId } from '../types/index.ts'
import { normalize } from './format.ts'

export function roundToman(value: number) {
  return Math.round(value / 1000) * 1000
}

export function unitPrice(base: number, size: SizeId, addonIds: string[], categoryId: string, offer = false) {
  const factor = SIZES.find((item) => item.id === size)?.factor ?? 1
  const catalog = addonsFor(categoryId)
  const extra = addonIds.reduce((sum, id) => sum + (catalog.find((item) => item.id === id)?.price ?? 0), 0)
  const raw = base * factor + extra
  return roundToman(offer ? raw * OFFER_RATE : raw)
}

export function lineKey(foodId: string, size: SizeId, addons: string[], offer: boolean) {
  return [foodId, size, [...addons].sort().join('+'), offer ? 'offer' : 'std'].join('|')
}

export function findCoupon(code: string) {
  const needle = normalize(code)
  return COUPONS.find((item) => normalize(item.code) === needle) ?? null
}

export function couponDiscount(subtotal: number, code: string | null) {
  if (!code || subtotal <= 0) return 0
  const coupon = findCoupon(code)
  if (!coupon) return 0
  if (coupon.type === 'percent') return roundToman((subtotal * coupon.value) / 100)
  return Math.min(subtotal, coupon.value)
}

export function deliveryCost(subtotal: number, settings: Settings) {
  if (subtotal <= 0) return 0
  if (subtotal >= settings.freeDeliveryFrom) return 0
  return settings.deliveryFee
}

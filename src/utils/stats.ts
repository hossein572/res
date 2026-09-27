import type { Food, Order } from '../types/index.ts'
import { shiftDate, todayKey } from './format.ts'

const WEEKDAY_BASE = [5.9, 6.8, 7.4, 8.1, 7.2, 9.6, 11.4]

export function activeOrders(orders: Order[]) {
  return orders.filter((order) => order.status !== 'cancelled')
}

export function isSameDay(iso: string, date: Date) {
  return iso.slice(0, 10) === todayKey(date)
}

export function dailySeries(orders: Order[], days = 7) {
  return Array.from({ length: days }, (_, index) => {
    const date = shiftDate(index - (days - 1))
    date.setHours(12, 0, 0, 0)
    const real = activeOrders(orders)
      .filter((order) => isSameDay(order.createdAt, date))
      .reduce((sum, order) => sum + order.total, 0)
    const baseline = WEEKDAY_BASE[date.getDay()] * 1_000_000
    const value = index === days - 1 ? Math.round(baseline * 0.42 + real) : baseline
    const label = new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(date)
    return { label, value, date: todayKey(date) }
  })
}

export function weeklySeries(orders: Order[]) {
  return Array.from({ length: 4 }, (_, index) => {
    const week = 3 - index
    const end = shiftDate(-week * 7)
    const start = shiftDate(-week * 7 - 6)
    const real = activeOrders(orders)
      .filter((order) => {
        const time = new Date(order.createdAt).getTime()
        return time >= start.getTime() && time <= end.getTime()
      })
      .reduce((sum, order) => sum + order.total, 0)
    const baseline = (8.4 + week * 0.35) * 7 * 1_000_000
    return {
      label: week === 0 ? 'این هفته' : `${week} هفته پیش`,
      value: week === 0 ? Math.round(baseline * 0.55 + real) : baseline,
    }
  })
}

export function monthlySeries(orders: Order[]) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date()
    date.setDate(1)
    date.setMonth(date.getMonth() - (5 - index))
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const real = activeOrders(orders)
      .filter((order) => order.createdAt.startsWith(key))
      .reduce((sum, order) => sum + order.total, 0)
    const baseline = (28 + (index % 3) * 3.2) * 1_000_000
    const current = index === 5
    return {
      label: new Intl.DateTimeFormat('fa-IR', { month: 'short' }).format(date),
      value: current ? Math.round(baseline * 0.7 + real) : baseline,
    }
  })
}

export function categorySales(orders: Order[], foods: Food[]) {
  const map = new Map<string, number>()
  for (const order of activeOrders(orders)) {
    for (const item of order.items) {
      const food = foods.find((entry) => entry.id === item.foodId)
      const key = food?.categoryId ?? 'other'
      map.set(key, (map.get(key) ?? 0) + item.unitPrice * item.quantity)
    }
  }
  const fallback: Record<string, number> = {
    pizza: 18600000,
    iranian: 16400000,
    burger: 11200000,
    pasta: 8400000,
    salad: 3200000,
    appetizer: 4100000,
    dessert: 2900000,
    drink: 2400000,
  }
  return Object.entries(fallback).map(([id, base]) => ({
    id,
    value: base + (map.get(id) ?? 0),
  }))
}

export function topFoods(orders: Order[], foods: Food[]) {
  const counts = new Map<string, { qty: number; total: number }>()
  for (const order of activeOrders(orders)) {
    for (const item of order.items) {
      const prev = counts.get(item.foodId) ?? { qty: 0, total: 0 }
      counts.set(item.foodId, {
        qty: prev.qty + item.quantity,
        total: prev.total + item.unitPrice * item.quantity,
      })
    }
  }
  return foods
    .map((food) => {
      const live = counts.get(food.id)
      return {
        food,
        qty: (live?.qty ?? 0) + Math.round(food.reviewCount / 8),
        total: (live?.total ?? 0) + food.price * Math.round(food.reviewCount / 12),
      }
    })
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)
}

import { useMemo, useState } from 'react'
import { useStore } from '../../context/Store.tsx'
import { useTitle } from '../../hooks/useTitle.ts'
import { formatDate, formatPhone, formatPrice, normalize, toFa } from '../../utils/format.ts'

export function CustomersAdminPage() {
  useTitle('مشتریان')
  const { orders } = useStore()
  const [q, setQ] = useState('')
  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; count: number; spent: number; last: string }>()
    for (const order of orders) {
      if (order.status === 'cancelled') continue
      const prev = map.get(order.phone)
      if (!prev) {
        map.set(order.phone, { name: order.name, phone: order.phone, count: 1, spent: order.total, last: order.createdAt })
      } else {
        map.set(order.phone, {
          ...prev,
          count: prev.count + 1,
          spent: prev.spent + order.total,
          last: order.createdAt > prev.last ? order.createdAt : prev.last,
        })
      }
    }
    return [...map.values()].sort((a, b) => b.spent - a.spent)
  }, [orders])
  const list = customers.filter((item) => normalize(`${item.name} ${item.phone}`).includes(normalize(q)))

  return (
    <div>
      <h1 className="text-2xl font-bold">مشتریان</h1>
      <input value={q} onChange={(event) => setQ(event.target.value)} className="control mt-4" placeholder="جستجوی نام یا موبایل" aria-label="جستجوی مشتری" />
      {list.length === 0 ? <p className="mt-8 text-sm text-muted">مشتری‌ای پیدا نشد.</p> : (
        <ul className="mt-4 divide-y divide-line bg-white">
          {list.map((item) => (
            <li key={item.phone} className="grid gap-1 p-3 text-sm sm:grid-cols-5 sm:items-center">
              <span className="font-semibold">{item.name}</span>
              <span>{formatPhone(item.phone)}</span>
              <span>{toFa(item.count)} سفارش</span>
              <span>{formatPrice(item.spent)}</span>
              <span className="text-muted">{formatDate(item.last)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useStore } from '../../context/Store.tsx'
import { useTitle } from '../../hooks/useTitle.ts'
import type { OrderStatus } from '../../types/index.ts'
import { STATUS_LABEL, cn, formatDateTime, formatPrice, toFa } from '../../utils/format.ts'

const STATUSES = Object.keys(STATUS_LABEL) as OrderStatus[]

export function OrdersAdminPage() {
  useTitle('سفارش‌ها')
  const { orders, setOrderStatus } = useStore()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [open, setOpen] = useState<string | null>(null)
  const list = orders.filter((order) => filter === 'all' || order.status === filter)

  return (
    <div>
      <h1 className="text-2xl font-bold">سفارش‌ها</h1>
      <div className="-mx-4 mt-4 px-4 scroller">
        <button type="button" className={cn('h-9 shrink-0 border px-3 text-sm', filter === 'all' ? 'border-ink bg-ink text-white' : 'border-line bg-white')} onClick={() => setFilter('all')}>همه</button>
        {STATUSES.map((status) => (
          <button key={status} type="button" className={cn('h-9 shrink-0 border px-3 text-sm', filter === status ? 'border-ink bg-ink text-white' : 'border-line bg-white')} onClick={() => setFilter(status)}>
            {STATUS_LABEL[status]}
          </button>
        ))}
      </div>
      {list.length === 0 ? <p className="mt-8 text-sm text-muted">سفارشی در این وضعیت نیست.</p> : (
        <ul className="mt-4 space-y-3">
          {list.map((order) => (
            <li key={order.id} className="bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{toFa(order.number)} · {order.name}</p>
                  <p className="text-sm text-muted">{formatDateTime(order.createdAt)} · {formatPrice(order.total)}</p>
                </div>
                <select
                  aria-label={`وضعیت ${order.number}`}
                  className="control h-10 w-auto"
                  value={order.status}
                  onChange={(event) => setOrderStatus(order.id, event.target.value as OrderStatus)}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{STATUS_LABEL[status]}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="mt-2 text-sm text-brand-deep" onClick={() => setOpen(open === order.id ? null : order.id)}>
                {open === order.id ? 'بستن جزئیات' : 'جزئیات'}
              </button>
              {open === order.id && (
                <div className="mt-3 border-t border-line pt-3 text-sm leading-7">
                  <p>{order.address}</p>
                  <p>{toFa(order.phone)}</p>
                  {order.note && <p>توضیح: {order.note}</p>}
                  <ul className="mt-2">
                    {order.items.map((item) => (
                      <li key={item.key}>{item.name} × {toFa(item.quantity)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

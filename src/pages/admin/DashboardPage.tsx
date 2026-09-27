import { Link } from 'react-router-dom'
import { BarChart } from '../../components/Charts.tsx'
import { useStore } from '../../context/Store.tsx'
import { useTitle } from '../../hooks/useTitle.ts'
import { STATUS_LABEL, formatPrice, toFa, todayKey } from '../../utils/format.ts'
import { dailySeries, monthlySeries, weeklySeries } from '../../utils/stats.ts'
import { useState } from 'react'

export function DashboardPage() {
  useTitle('داشبورد')
  const { orders, reservations } = useStore()
  const [range, setRange] = useState<'day' | 'week' | 'month'>('day')
  const today = todayKey()
  const todayOrders = orders.filter((order) => order.createdAt.slice(0, 10) === today && order.status !== 'cancelled')
  const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0)
  const preparing = orders.filter((order) => order.status === 'preparing' || order.status === 'new' || order.status === 'ready').length
  const monthKey = today.slice(0, 7)
  const monthIncome = orders
    .filter((order) => order.createdAt.startsWith(monthKey) && order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0)
  const average = todayOrders.length ? todaySales / todayOrders.length : 0
  const chart = range === 'day' ? dailySeries(orders) : range === 'week' ? weeklySeries(orders) : monthlySeries(orders)

  const stats = [
    { label: 'فروش امروز', value: formatPrice(todaySales) },
    { label: 'سفارش امروز', value: toFa(todayOrders.length) },
    { label: 'درآمد این ماه', value: formatPrice(monthIncome) },
    { label: 'در حال آماده‌سازی', value: toFa(preparing) },
    { label: 'میانگین مبلغ سفارش', value: formatPrice(average) },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold">داشبورد</h1>
      <p className="mt-1 text-sm text-muted">خلاصه امروز رستوران</p>
      <div className="mt-5 grid grid-cols-2 gap-px bg-line lg:grid-cols-5">
        {stats.map((item) => (
          <div key={item.label} className="bg-white p-4">
            <p className="text-xs text-muted">{item.label}</p>
            <p className="mt-2 text-lg font-bold leading-7">{item.value}</p>
          </div>
        ))}
      </div>
      <section className="mt-6 bg-white p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold">فروش</h2>
          <div className="flex gap-2 text-sm">
            {([
              ['day', 'روزانه'],
              ['week', 'هفتگی'],
              ['month', 'ماهانه'],
            ] as const).map(([id, label]) => (
              <button key={id} type="button" className={range === id ? 'font-semibold text-brand-deep' : 'text-muted'} onClick={() => setRange(id)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <BarChart data={chart} />
      </section>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">سفارش‌های اخیر</h2>
            <Link to="/admin/orders" className="text-sm text-brand-deep">همه</Link>
          </div>
          <ul className="mt-3 divide-y divide-line text-sm">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-2 py-2">
                <span>{toFa(order.number)} · {order.name}</span>
                <span className="text-muted">{STATUS_LABEL[order.status]}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-white p-4">
          <h2 className="font-bold">رزروهای پیش رو</h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {reservations.filter((item) => item.status !== 'cancelled').slice(0, 5).map((item) => (
              <li key={item.id} className="py-2">
                {item.name} · {item.time} · {toFa(item.guests)} نفر
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

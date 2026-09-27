import { useState } from 'react'
import { BarChart, HBars, LineChart } from '../../components/Charts.tsx'
import { CATEGORIES } from '../../data/catalog.ts'
import { useStore } from '../../context/Store.tsx'
import { useTitle } from '../../hooks/useTitle.ts'
import { formatPrice, toFa } from '../../utils/format.ts'
import { categorySales, dailySeries, monthlySeries, topFoods, weeklySeries } from '../../utils/stats.ts'

export function ReportsPage() {
  useTitle('گزارش‌ها')
  const { orders, foods, categories } = useStore()
  const [range, setRange] = useState<'day' | 'week' | 'month'>('day')
  const series = range === 'day' ? dailySeries(orders) : range === 'week' ? weeklySeries(orders) : monthlySeries(orders)
  const cats = categorySales(orders, foods).map((item) => ({
    label: categories.find((category) => category.id === item.id)?.name ?? CATEGORIES.find((category) => category.id === item.id)?.name ?? item.id,
    value: item.value,
  }))
  const tops = topFoods(orders, foods)
  const count = orders.filter((order) => order.status !== 'cancelled').length
  const revenue = orders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold">گزارش‌ها</h1>
      <div className="mt-4 grid gap-px bg-line sm:grid-cols-2">
        <div className="bg-white p-4"><p className="text-xs text-muted">تعداد سفارش</p><p className="mt-1 text-2xl font-bold">{toFa(count)}</p></div>
        <div className="bg-white p-4"><p className="text-xs text-muted">فروش ثبت‌شده</p><p className="mt-1 text-2xl font-bold">{formatPrice(revenue)}</p></div>
      </div>
      <section className="mt-4 bg-white p-4">
        <div className="mb-3 flex gap-3 text-sm">
          {([
            ['day', 'درآمد روزانه'],
            ['week', 'هفتگی'],
            ['month', 'ماهانه'],
          ] as const).map(([id, label]) => (
            <button key={id} type="button" className={range === id ? 'font-semibold' : 'text-muted'} onClick={() => setRange(id)}>{label}</button>
          ))}
        </div>
        {range === 'month' ? <LineChart data={series} /> : <BarChart data={series} />}
      </section>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="bg-white p-4">
          <h2 className="mb-4 font-bold">فروش بر اساس دسته‌بندی</h2>
          <HBars data={cats} />
        </section>
        <section className="bg-white p-4">
          <h2 className="mb-4 font-bold">محبوب‌ترین غذاها</h2>
          <ol className="space-y-3 text-sm">
            {tops.map((item, index) => (
              <li key={item.food.id} className="flex items-center justify-between gap-3">
                <span>{toFa(index + 1)}. {item.food.name}</span>
                <span className="text-muted">{toFa(item.qty)} سفارش</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}

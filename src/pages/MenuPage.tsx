import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { FoodCard } from '../components/FoodCard.tsx'
import { EmptyState, Modal } from '../components/ui.tsx'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'
import type { SortKey } from '../types/index.ts'
import { cn, normalize, toFa } from '../utils/format.ts'

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'default', label: 'پیش‌فرض' },
  { id: 'price-asc', label: 'ارزان‌ترین' },
  { id: 'price-desc', label: 'گران‌ترین' },
  { id: 'rating', label: 'بیشترین امتیاز' },
  { id: 'fast', label: 'سریع‌ترین آماده‌سازی' },
]

export function MenuPage() {
  useTitle('منوی چاشنی')
  const { foods, categories } = useStore()
  const [params, setParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const cat = params.get('cat') ?? 'all'
  const q = params.get('q') ?? ''
  const sort = (params.get('sort') as SortKey) || 'default'
  const availableOnly = params.get('available') === '1'
  const topRated = params.get('rated') === '1'

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'all' || value === 'default') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const visible = useMemo(() => {
    const query = normalize(q)
    let list = foods.filter((food) => {
      const category = categories.find((item) => item.id === food.categoryId)
      if (category && !category.visible) return false
      if (cat !== 'all' && food.categoryId !== cat) return false
      if (availableOnly && !food.available) return false
      if (topRated && food.rating < 4.5) return false
      if (query && !normalize(`${food.name} ${food.description} ${food.ingredients.join(' ')}`).includes(query)) return false
      return true
    })
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'fast') list = [...list].sort((a, b) => a.prepMin - b.prepMin)
    return list
  }, [availableOnly, cat, categories, foods, q, sort, topRated])

  const chips = [{ id: 'all', short: 'همه' }, ...categories.filter((item) => item.visible).map((item) => ({ id: item.id, short: item.short }))]

  return (
    <div className="wrap py-6 md:py-10">
      <h1 className="text-[28px] font-bold">منوی چاشنی</h1>
      <p className="mt-1 max-w-xl text-sm leading-7 text-muted">
        پیتزا، برگر، پاستا و غذاهای ایرانی. قیمت‌ها به تومان است و قبل از ثبت سفارش، اندازه و افزودنی را انتخاب می‌کنید.
      </p>

      <div className="mt-5 flex gap-2">
        <input
          value={q}
          onChange={(event) => setParam('q', event.target.value)}
          placeholder="جستجوی غذا"
          aria-label="جستجوی غذا"
          className="control"
        />
        <button type="button" className="btn btn-ghost shrink-0 px-3 lg:hidden" aria-label="فیلتر" onClick={() => setFilterOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" />
          فیلتر
        </button>
      </div>

      <div className="-mx-4 mt-4 px-4 scroller">
        {chips.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={cat === item.id}
            onClick={() => setParam('cat', item.id)}
            className={cn(
              'h-9 shrink-0 border px-3 text-sm',
              cat === item.id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink',
            )}
          >
            {item.short}
          </button>
        ))}
      </div>

      <div className="mt-4 hidden items-center justify-between gap-3 lg:flex">
        <p className="text-sm text-muted">{toFa(visible.length)} غذا</p>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={availableOnly} onChange={(event) => setParam('available', event.target.checked ? '1' : '')} />
            فقط موجود
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={topRated} onChange={(event) => setParam('rated', event.target.checked ? '1' : '')} />
            امتیاز ۴.۵ به بالا
          </label>
          <select aria-label="مرتب‌سازی" className="control h-10 w-auto" value={sort} onChange={(event) => setParam('sort', event.target.value)}>
            {SORTS.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted lg:hidden">{toFa(visible.length)} غذا</p>

      {visible.length === 0 ? (
        <EmptyState
          title="غذایی با این مشخصات پیدا نشد"
          text="فیلتر را بردارید یا نام دیگری را جستجو کنید."
          action={
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setParams({})}
            >
              پاک کردن فیلترها
            </button>
          }
        />
      ) : (
        <div className="mt-4 hidden min-[380px]:grid min-[380px]:grid-cols-2 min-[380px]:gap-x-3 min-[380px]:gap-y-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
      <div className="mt-2 min-[380px]:hidden">
        {visible.map((food) => (
          <FoodCard key={food.id} food={food} variant="row" />
        ))}
      </div>

      <Modal open={filterOpen} title="فیلتر و مرتب‌سازی" onClose={() => setFilterOpen(false)}>
        <div className="space-y-4">
          <label className="flex items-center justify-between gap-3 text-sm">
            فقط غذاهای موجود
            <input type="checkbox" checked={availableOnly} onChange={(event) => setParam('available', event.target.checked ? '1' : '')} />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm">
            امتیاز ۴.۵ به بالا
            <input type="checkbox" checked={topRated} onChange={(event) => setParam('rated', event.target.checked ? '1' : '')} />
          </label>
          <div className="field">
            <span>مرتب‌سازی</span>
            <select value={sort} onChange={(event) => setParam('sort', event.target.value)}>
              {SORTS.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>
          <button type="button" className="btn btn-primary w-full" onClick={() => setFilterOpen(false)}>
            نمایش {toFa(visible.length)} غذا
          </button>
        </div>
      </Modal>
    </div>
  )
}

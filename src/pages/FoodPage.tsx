import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { FoodCard } from '../components/FoodCard.tsx'
import { Button, ErrorState, Photo, Price, Qty, Rating } from '../components/ui.tsx'
import { REVIEWS, SIZES, addonsFor } from '../data/catalog.ts'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'
import type { SizeId } from '../types/index.ts'
import { cn, formatDate, formatNumber, formatPrice, toFa } from '../utils/format.ts'
import { unitPrice } from '../utils/money.ts'

export function FoodPage() {
  const { id = '' } = useParams()
  const { foods, favorites, toggleFav, addToCart } = useStore()
  const food = foods.find((item) => item.id === id)
  useTitle(food?.name ?? 'غذا')
  const offer = new URLSearchParams(window.location.search).get('offer') === '1' && food?.id === 'pizza-special'
  const [size, setSize] = useState<SizeId>('medium')
  const [addons, setAddons] = useState<string[]>([])
  const [qty, setQty] = useState(1)

  const options = food ? addonsFor(food.categoryId) : []
  const price = food ? unitPrice(food.price, size, addons, food.categoryId, offer) : 0
  const base = food ? unitPrice(food.price, size, addons, food.categoryId, false) : 0
  const reviews = useMemo(() => REVIEWS.filter((item) => item.foodId === id), [id])
  const related = foods.filter((item) => food && item.categoryId === food.categoryId && item.id !== food.id).slice(0, 4)

  if (!food) {
    return <ErrorState title="این غذا پیدا نشد" text="ممکن است از منو حذف شده باشد." onRetry={() => { window.location.href = `${import.meta.env.BASE_URL}menu` }} />
  }

  const fav = favorites.includes(food.id)

  const toggleAddon = (addonId: string) => {
    setAddons((prev) => (prev.includes(addonId) ? prev.filter((item) => item !== addonId) : [...prev, addonId]))
  }

  const add = () => addToCart({ food, size, addons, qty, offer })

  return (
    <div className="pb-36 lg:pb-12">
      <div className="wrap py-4 text-sm text-muted">
        <Link to="/menu" className="text-muted no-underline hover:text-ink">منو</Link>
        <span> / </span>
        <span>{food.name}</span>
      </div>
      <div className="wrap grid gap-6 lg:grid-cols-2 lg:gap-12 lg:pb-10">
        <Photo src={food.image} alt={food.name} eager className="aspect-[4/3] lg:aspect-[5/4]" />
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-[28px] font-bold leading-snug">{food.name}</h1>
            <button
              type="button"
              aria-label={fav ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'}
              aria-pressed={fav}
              onClick={() => toggleFav(food.id)}
              className="grid h-11 w-11 shrink-0 place-items-center border border-line"
            >
              <Heart className={cn('h-5 w-5', fav && 'fill-brand text-brand')} />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <Rating value={food.rating} count={food.reviewCount} />
            <span className="text-muted">{toFa(food.prepMin)} دقیقه</span>
            {!food.available && <span className="text-danger">ناموجود</span>}
            {offer && <span className="bg-[#F8F1EE] px-2 py-0.5 text-brand-deep">تخفیف امروز</span>}
          </div>
          <Price value={price} old={offer ? base : undefined} className="mt-4 text-xl font-bold" />
          <p className="mt-4 text-[15px] leading-8 text-muted">{food.details}</p>

          <div className="mt-6">
            <h2 className="text-sm font-semibold">اندازه</h2>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {SIZES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={size === item.id}
                  onClick={() => setSize(item.id)}
                  className={cn('h-11 border text-sm', size === item.id ? 'border-ink bg-ink text-white' : 'border-line')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold">افزودنی‌ها</h2>
            <ul className="mt-2 divide-y divide-line border-y border-line">
              {options.map((addon) => {
                const checked = addons.includes(addon.id)
                return (
                  <li key={addon.id}>
                    <label className="flex cursor-pointer items-center justify-between gap-3 py-3 text-sm">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={checked} onChange={() => toggleAddon(addon.id)} />
                        {addon.name}
                      </span>
                      <span className="text-muted">+ {formatNumber(addon.price)}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mt-6 hidden items-center gap-3 lg:flex">
            <Qty value={qty} onChange={setQty} />
            <Button className="min-w-44" disabled={!food.available} onClick={add}>افزودن به سبد</Button>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-4 text-sm">
            <div>
              <dt className="text-muted">آماده‌سازی</dt>
              <dd className="font-semibold">{toFa(food.prepMin)} دقیقه</dd>
            </div>
            <div>
              <dt className="text-muted">کالری تقریبی</dt>
              <dd className="font-semibold">{toFa(food.calories)}</dd>
            </div>
            <div>
              <dt className="text-muted">مناسب برای</dt>
              <dd className="font-semibold">{food.serves}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-7 text-muted">
            <span className="font-semibold text-ink">مواد اولیه: </span>
            {food.ingredients.join('، ')}
          </p>
        </div>
      </div>

      <section className="wrap mt-4 border-t border-line py-8">
        <h2 className="text-lg font-bold">نظرها</h2>
        {reviews.length === 0 ? (
          <p className="mt-3 text-sm text-muted">هنوز نظری برای این غذا ثبت نشده.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {reviews.map((review) => (
              <li key={review.id} className="py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{review.name}</p>
                  <Rating value={review.rating} />
                </div>
                <p className="mt-1 text-sm leading-7">{review.text}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(review.date)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {related.length > 0 && (
        <section className="wrap pb-8">
          <h2 className="mb-4 text-lg font-bold">از همین دسته</h2>
          <div className="-mx-4 px-4 scroller">
            {related.map((item) => (
              <FoodCard key={item.id} food={item} variant="scroll" />
            ))}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white p-3 lg:hidden" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <Qty value={qty} onChange={setQty} />
          <p className="text-sm font-bold">{formatPrice(price * qty)}</p>
        </div>
        <Button full disabled={!food.available} onClick={add}>افزودن به سبد</Button>
      </div>
    </div>
  )
}

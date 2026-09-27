import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink, EmptyState, Photo, Qty } from '../components/ui.tsx'
import { COUPONS, addonName } from '../data/catalog.ts'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'
import { SIZE_LABEL, formatPrice, toFa } from '../utils/format.ts'

export function CartPage() {
  useTitle('سبد خرید')
  const { cart, setQty, removeLine, subtotal, discount, delivery, total, coupon, setCoupon, clearCoupon, settings } = useStore()
  const [code, setCode] = useState(coupon ?? '')

  if (cart.length === 0) {
    return (
      <EmptyState
        title="سبد خرید خالی است"
        text="هنوز غذایی انتخاب نکرده‌اید. منو باز است."
        action={<ButtonLink to="/menu">مشاهده منو</ButtonLink>}
      />
    )
  }

  const belowMin = subtotal < settings.minOrder

  return (
    <div className="wrap py-6 pb-36 md:pb-10">
      <h1 className="text-[28px] font-bold">سبد خرید</h1>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-line">
          {cart.map((line) => (
            <li key={line.key} className="flex gap-3 py-4">
              <Photo src={line.image} alt="" className="h-20 w-20 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link to={`/food/${line.foodId}`} className="font-semibold text-ink no-underline">{line.name}</Link>
                    <p className="text-[13px] text-muted">
                      {SIZE_LABEL[line.size]}
                      {line.addons.length > 0 && ` · ${line.addons.map(addonName).join('، ')}`}
                      {line.offer && ' · تخفیف امروز'}
                    </p>
                  </div>
                  <button type="button" className="grid h-10 w-10 place-items-center text-muted" aria-label={`حذف ${line.name}`} onClick={() => removeLine(line.key)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <Qty value={line.quantity} onChange={(qty) => setQty(line.key, qty)} min={0} />
                  <span className="text-sm font-semibold">{formatPrice(line.unitPrice * line.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-line p-4 lg:sticky lg:top-20">
          <h2 className="font-bold">کد تخفیف</h2>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              setCoupon(code)
            }}
          >
            <input value={code} onChange={(event) => setCode(event.target.value)} className="control" placeholder="کد را وارد کنید" aria-label="کد تخفیف" />
            <button type="submit" className="btn btn-secondary shrink-0">اعمال</button>
          </form>
          {coupon && (
            <button type="button" className="mt-2 text-sm text-brand-deep" onClick={clearCoupon}>
              حذف کد {coupon}
            </button>
          )}
          <p className="mt-2 text-xs leading-6 text-muted">کدهای فعال: {COUPONS.map((item) => item.code).join('، ')}</p>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">قیمت کل</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">هزینه ارسال</dt><dd>{delivery === 0 ? 'رایگان' : formatPrice(delivery)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">تخفیف</dt><dd>{discount ? formatPrice(discount) : '—'}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-bold"><dt>مبلغ نهایی</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          {belowMin && (
            <p className="mt-3 text-xs leading-6 text-danger">حداقل سفارش {formatPrice(settings.minOrder)} است.</p>
          )}
          <p className="mt-3 text-xs leading-6 text-muted">ارسال رایگان برای سفارش‌های بالای {formatPrice(settings.freeDeliveryFrom)}.</p>
          <ButtonLink to="/checkout" className="mt-4 hidden w-full lg:inline-flex">ادامه سفارش</ButtonLink>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white p-3 lg:hidden" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted">مبلغ نهایی</p>
            <p className="truncate text-base font-bold">{formatPrice(total)}</p>
          </div>
          <ButtonLink to="/checkout" className="shrink-0 px-3 text-sm">ادامه سفارش</ButtonLink>
        </div>
        {belowMin && <p className="mt-1 text-[11px] text-danger">حداقل سفارش {toFa(settings.minOrder.toLocaleString('en-US'))} تومان</p>}
      </div>
    </div>
  )
}

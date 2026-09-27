import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui.tsx'
import { addonName } from '../data/catalog.ts'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'
import type { PayMethod } from '../types/index.ts'
import { SIZE_LABEL, cn, formatPrice, isMobile } from '../utils/format.ts'

const STEPS = ['اطلاعات ارسال', 'روش پرداخت', 'تأیید سفارش']

export function CheckoutPage() {
  useTitle('پرداخت')
  const store = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(store.profile?.name ?? '')
  const [phone, setPhone] = useState(store.profile?.phone ?? '')
  const [address, setAddress] = useState(store.addresses[0]?.text ?? '')
  const [note, setNote] = useState('')
  const [payment, setPayment] = useState<PayMethod>('online')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (store.cart.length === 0) return <Navigate to="/cart" replace />

  const next = () => {
    if (step === 0) {
      if (name.trim().length < 2) return setError('نام را کامل وارد کنید.')
      if (!isMobile(phone)) return setError('شماره موبایل معتبر نیست.')
      if (address.trim().length < 8) return setError('آدرس را دقیق‌تر بنویسید.')
      if (store.subtotal < store.settings.minOrder) return setError('مبلغ سفارش از حداقل مجاز کمتر است.')
    }
    setError('')
    setStep((value) => Math.min(2, value + 1))
  }

  const submit = () => {
    setLoading(true)
    window.setTimeout(() => {
      const order = store.placeOrder({ name, phone, address, note, payment })
      setLoading(false)
      if (order) navigate(`/order/${order.id}`)
    }, 700)
  }

  return (
    <div className="wrap py-6 pb-28 lg:pb-10">
      <h1 className="text-[28px] font-bold">ثبت سفارش</h1>
      <ol className="mt-4 grid grid-cols-3 gap-2 text-[12px] sm:text-sm">
        {STEPS.map((label, index) => (
          <li key={label} className={cn('border-t-2 pt-2', index <= step ? 'border-brand text-ink' : 'border-line text-muted')}>
            {label}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          {step === 0 && (
            <div className="space-y-4">
              {store.addresses.length > 0 && (
                <div>
                  <p className="mb-2 text-sm text-muted">آدرس‌های ذخیره‌شده</p>
                  <div className="space-y-2">
                    {store.addresses.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAddress(item.text)}
                        className={cn('block w-full border p-3 text-start text-sm', address === item.text ? 'border-ink' : 'border-line')}
                      >
                        <span className="font-semibold">{item.title}</span>
                        <span className="mt-1 block text-muted">{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <label className="field"><span>نام</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
              <label className="field"><span>شماره موبایل</span><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="۰۹۱۲xxxxxxx" /></label>
              <label className="field"><span>آدرس</span><textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="محله، خیابان، پلاک، واحد" /></label>
              <label className="field"><span>توضیحات سفارش</span><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثلاً زنگ واحد را بزنید" /></label>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              {([
                ['online', 'پرداخت آنلاین', 'در این نسخه آزمایشی مبلغی کسر نمی‌شود.'],
                ['cash', 'پرداخت در محل', 'مبلغ را هنگام تحویل به پیک می‌دهید.'],
              ] as const).map(([id, label, hint]) => (
                <label key={id} className={cn('flex cursor-pointer gap-3 border p-4', payment === id ? 'border-ink' : 'border-line')}>
                  <input type="radio" name="pay" checked={payment === id} onChange={() => setPayment(id)} />
                  <span>
                    <span className="block font-semibold">{label}</span>
                    <span className="mt-1 block text-sm text-muted">{hint}</span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-sm leading-7">
              <p><span className="text-muted">گیرنده: </span>{name} · {phone}</p>
              <p><span className="text-muted">آدرس: </span>{address}</p>
              {note && <p><span className="text-muted">توضیح: </span>{note}</p>}
              <p><span className="text-muted">پرداخت: </span>{payment === 'online' ? 'پرداخت آنلاین' : 'پرداخت در محل'}</p>
              <ul className="divide-y divide-line border-y border-line">
                {store.cart.map((line) => (
                  <li key={line.key} className="flex justify-between gap-3 py-2">
                    <span>
                      {line.name}
                      <span className="text-muted"> · {SIZE_LABEL[line.size]} · {line.quantity}</span>
                      {line.addons.length > 0 && <span className="block text-xs text-muted">{line.addons.map(addonName).join('، ')}</span>}
                    </span>
                    <span className="shrink-0">{formatPrice(line.unitPrice * line.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-danger" role="alert">{error}</p>}

          <div className="mt-6 hidden gap-2 lg:flex">
            {step > 0 && <Button variant="ghost" onClick={() => setStep((value) => value - 1)}>مرحله قبل</Button>}
            {step < 2 ? <Button onClick={next}>ادامه</Button> : <Button loading={loading} onClick={submit}>ثبت سفارش</Button>}
          </div>
        </div>

        <aside className="h-fit border border-line bg-paper p-4 lg:sticky lg:top-20">
          <h2 className="font-bold">خلاصه سفارش</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {store.cart.map((line) => (
              <li key={line.key} className="flex justify-between gap-2">
                <span className="truncate">{line.name} × {line.quantity}</span>
                <span className="shrink-0">{formatPrice(line.unitPrice * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-line pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">جمع</dt><dd>{formatPrice(store.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">ارسال</dt><dd>{store.delivery ? formatPrice(store.delivery) : 'رایگان'}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">تخفیف</dt><dd>{store.discount ? formatPrice(store.discount) : '—'}</dd></div>
            <div className="flex justify-between pt-1 font-bold"><dt>نهایی</dt><dd>{formatPrice(store.total)}</dd></div>
          </dl>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white p-3 lg:hidden" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
        {step < 2 ? (
          <Button full onClick={next}>ادامه</Button>
        ) : (
          <Button full loading={loading} onClick={submit}>ثبت سفارش · {formatPrice(store.total)}</Button>
        )}
      </div>
    </div>
  )
}

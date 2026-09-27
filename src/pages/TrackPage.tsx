import { useMemo, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'
import { PAY_LABEL, STATUS_LABEL, cn, formatClock, formatPrice, normalize, toFa, trackIndex } from '../utils/format.ts'

const STEPS = ['سفارش ثبت شد', 'سفارش تأیید شد', 'در حال آماده‌سازی', 'تحویل به پیک', 'تحویل داده شد']

export function TrackPage() {
  useTitle('پیگیری سفارش')
  const { id } = useParams()
  const { orders } = useStore()
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<string | null>(id ?? null)

  const order = useMemo(() => {
    if (picked) {
      return orders.find((item) => item.id === picked || normalize(item.number) === normalize(picked)) ?? null
    }
    return null
  }, [orders, picked])

  const search = (event: FormEvent) => {
    event.preventDefault()
    const found = orders.find((item) => normalize(item.number) === normalize(query) || item.id === query.trim())
    setPicked(found ? found.id : query.trim())
  }

  if (!order) {
    return (
      <div className="wrap max-w-lg py-10">
        <h1 className="text-[28px] font-bold">پیگیری سفارش</h1>
        <p className="mt-2 text-sm text-muted">شماره سفارش را وارد کنید. مثلاً یکی از سفارش‌های نمونه.</p>
        <form className="mt-5 flex gap-2" onSubmit={search}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="control" placeholder="شماره سفارش" aria-label="شماره سفارش" />
          <button type="submit" className="btn btn-primary shrink-0">پیگیری</button>
        </form>
        {picked && <p className="mt-4 text-sm text-danger" role="alert">سفارشی با این شماره پیدا نشد.</p>}
        <ul className="mt-6 space-y-2 text-sm">
          {orders.slice(0, 4).map((item) => (
            <li key={item.id}>
              <button type="button" className="text-brand-deep" onClick={() => setPicked(item.id)}>
                {toFa(item.number)} · {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const current = trackIndex(order.status)
  const eta = new Date(order.createdAt)
  eta.setMinutes(eta.getMinutes() + order.etaMin)

  return (
    <div className="wrap py-8 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
      <div>
        <p className="text-sm text-muted">شماره سفارش</p>
        <h1 className="text-[28px] font-bold">{toFa(order.number)}</h1>
        <p className="mt-1 text-sm text-muted">وضعیت: {STATUS_LABEL[order.status]}</p>
        {order.status === 'cancelled' ? (
          <p className="mt-8 border border-line bg-paper p-4 text-sm">این سفارش لغو شده است.</p>
        ) : (
          <ol className="mt-8 space-y-0">
            {STEPS.map((label, index) => {
              const done = index < current
              const active = index === current
              return (
                <li key={label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={cn('grid h-7 w-7 place-items-center text-xs', active || done ? 'bg-brand text-white' : 'bg-paper text-muted')}>
                      {toFa(index + 1)}
                    </span>
                    {index < STEPS.length - 1 && <span className={cn('w-px flex-1', index < current ? 'bg-brand' : 'bg-line')} />}
                  </div>
                  <div className="pb-6">
                    <p className={cn('font-semibold', !active && !done && 'text-muted')}>{label}</p>
                    {active && order.status === 'ready' && <p className="text-sm text-muted">غذا آماده است و منتظر پیک می‌ماند.</p>}
                    {active && <p className="text-sm text-brand-deep">مرحله فعلی</p>}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
      <aside className="mt-4 h-fit border border-line p-4 text-sm lg:mt-0">
        <dl className="space-y-2">
          <div className="flex justify-between gap-3"><dt className="text-muted">مبلغ</dt><dd>{formatPrice(order.total)}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">پرداخت</dt><dd>{PAY_LABEL[order.payment]}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">تحویل حدود</dt><dd>{formatClock(eta.toISOString())}</dd></div>
        </dl>
        <p className="mt-3 leading-7 text-muted">{order.address}</p>
        <ul className="mt-3 space-y-1 border-t border-line pt-3">
          {order.items.map((item) => (
            <li key={item.key} className="flex justify-between gap-2">
              <span>{item.name} × {toFa(item.quantity)}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

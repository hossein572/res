import { Link, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { ButtonLink, ErrorState } from '../components/ui.tsx'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'
import { PAY_LABEL, formatClock, formatPrice, toFa } from '../utils/format.ts'

export function OrderSuccessPage() {
  const { id = '' } = useParams()
  const { orders } = useStore()
  const order = orders.find((item) => item.id === id)
  useTitle('سفارش ثبت شد')

  if (!order) {
    return <ErrorState title="سفارش پیدا نشد" text="شماره را در پیگیری سفارش وارد کنید." onRetry={() => { window.location.href = `${import.meta.env.BASE_URL}track` }} />
  }

  const eta = new Date(order.createdAt)
  eta.setMinutes(eta.getMinutes() + order.etaMin)

  return (
    <div className="wrap max-w-xl py-12">
      <div className="grid h-12 w-12 place-items-center bg-ok text-white">
        <Check className="h-6 w-6" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-[28px] font-bold leading-snug">سفارش شما با موفقیت ثبت شد</h1>
      <p className="mt-2 text-sm leading-7 text-muted">رسید را نگه دارید. وضعیت را از صفحه پیگیری می‌بینید.</p>
      <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
        <div className="flex justify-between py-3"><dt className="text-muted">شماره سفارش</dt><dd className="font-bold">{toFa(order.number)}</dd></div>
        <div className="flex justify-between py-3"><dt className="text-muted">مبلغ</dt><dd className="font-bold">{formatPrice(order.total)}</dd></div>
        <div className="flex justify-between py-3"><dt className="text-muted">زمان تقریبی تحویل</dt><dd className="font-bold">{formatClock(eta.toISOString())}</dd></div>
        <div className="flex justify-between py-3"><dt className="text-muted">پرداخت</dt><dd>{PAY_LABEL[order.payment]}</dd></div>
      </dl>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <ButtonLink to={`/track/${order.id}`}>پیگیری سفارش</ButtonLink>
        <Link to="/menu" className="btn btn-ghost">بازگشت به منو</Link>
      </div>
    </div>
  )
}

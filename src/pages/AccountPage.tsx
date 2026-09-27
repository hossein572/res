import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, ButtonLink, EmptyState } from '../components/ui.tsx'
import { TABLE_TYPES } from '../data/catalog.ts'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'
import { PAY_LABEL, STATUS_LABEL, formatDateTime, formatDayKey, formatPhone, formatPrice, toFa } from '../utils/format.ts'

const SECTIONS = [
  { id: 'orders', label: 'سفارش‌های من' },
  { id: 'reservations', label: 'رزروهای من' },
  { id: 'favorites', label: 'علاقه‌مندی‌ها' },
  { id: 'addresses', label: 'آدرس‌ها' },
  { id: 'profile', label: 'اطلاعات حساب' },
]

export function AccountPage() {
  useTitle('حساب کاربری')
  const store = useStore()
  const [params, setParams] = useSearchParams()
  const section = params.get('section')
  const [name, setName] = useState(store.profile?.name ?? '')
  const [phone, setPhone] = useState(store.profile?.phone ?? '')
  const [title, setTitle] = useState('خانه')
  const [text, setText] = useState('')
  const [addrPhone, setAddrPhone] = useState(store.profile?.phone ?? '')

  const guestBlocked = !store.profile && (!section || section === 'profile' || section === 'addresses')
  if (guestBlocked) {
    return (
      <div className="wrap py-8">
        <EmptyState
          title="وارد حساب نشده‌اید"
          text="برای ذخیره نام و آدرس وارد شوید. سفارش‌های همین دستگاه بدون ورود هم دیده می‌شوند."
          action={<ButtonLink to="/login?next=/account">ورود</ButtonLink>}
        />
        <div className="flex justify-center">
          <ButtonLink to="/account?section=orders" variant="secondary">سفارش‌های این دستگاه</ButtonLink>
        </div>
      </div>
    )
  }

  const shownOrders = store.profile
    ? store.orders.filter((order) => order.phone === store.profile?.phone)
    : store.orders
  const shownReservations = store.profile
    ? store.reservations.filter((item) => item.phone === store.profile?.phone)
    : store.reservations

  return (
    <div className="wrap py-6 md:grid md:grid-cols-[220px_1fr] md:gap-10 md:py-10">
      <aside className={section ? 'hidden md:block' : ''}>
        <h1 className="text-xl font-bold">{store.profile?.name ?? 'مهمان'}</h1>
        <p className="text-sm text-muted">{store.profile ? formatPhone(store.profile.phone) : 'سفارش‌های همین دستگاه'}</p>
        <nav className="mt-4 divide-y divide-line border-y border-line" aria-label="بخش‌های حساب">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex w-full items-center justify-between py-3 text-start text-sm"
              onClick={() => setParams({ section: item.id })}
            >
              {item.label}
              <span className="text-muted">‹</span>
            </button>
          ))}
          {store.profile && (
            <button type="button" className="w-full py-3 text-start text-sm text-danger" onClick={store.logout}>
              خروج
            </button>
          )}
        </nav>
      </aside>

      <section className={section ? '' : 'hidden md:block'}>
        {section && (
          <button type="button" className="mb-3 text-sm text-muted md:hidden" onClick={() => setParams({})}>
            بازگشت
          </button>
        )}
        {(section === 'orders' || (!section && true)) && (section === 'orders' || !section) && (
          <div className={!section ? 'hidden md:block' : ''}>
            <h2 className="text-lg font-bold">سفارش‌های من</h2>
            {shownOrders.length === 0 ? (
              <EmptyState title="سفارشی ندارید" action={<ButtonLink to="/menu">مشاهده منو</ButtonLink>} />
            ) : (
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {shownOrders.map((order) => (
                  <li key={order.id} className="py-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{toFa(order.number)}</p>
                        <p className="text-muted">{formatDateTime(order.createdAt)}</p>
                      </div>
                      <span className="text-xs">{STATUS_LABEL[order.status]}</span>
                    </div>
                    <p className="mt-1">{formatPrice(order.total)} · {PAY_LABEL[order.payment]}</p>
                    <Link to={`/track/${order.id}`} className="mt-1 inline-block text-brand-deep">جزئیات سفارش</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {section === 'reservations' && (
          <div>
            <h2 className="text-lg font-bold">رزروهای من</h2>
            {shownReservations.length === 0 ? (
              <EmptyState title="رزروی ندارید" action={<ButtonLink to="/reserve">رزرو میز</ButtonLink>} />
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {shownReservations.map((item) => (
                    <li key={item.id} className="py-3 text-sm">
                      <p className="font-semibold">{toFa(item.number)} · {item.time}</p>
                      <p className="text-muted">{formatDayKey(item.date)} · {toFa(item.guests)} نفر · {TABLE_TYPES.find((type) => type.id === item.tableType)?.label}</p>
                      <p className="mt-1">{item.status === 'cancelled' ? 'لغو شده' : item.status === 'confirmed' ? 'تأیید شده' : 'در انتظار'}</p>
                      {item.status !== 'cancelled' && (
                        <button type="button" className="mt-1 text-danger" onClick={() => store.cancelReservation(item.id)}>لغو رزرو</button>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}

        {section === 'favorites' && (
          <div>
            <h2 className="text-lg font-bold">علاقه‌مندی‌ها</h2>
            <ButtonLink to="/favorites" variant="secondary" className="mt-4">مشاهده علاقه‌مندی‌ها</ButtonLink>
          </div>
        )}

        {section === 'addresses' && (
          <div>
            <h2 className="text-lg font-bold">آدرس‌ها</h2>
            <ul className="mt-4 divide-y divide-line">
              {store.addresses.filter((item) => !store.profile || item.phone === store.profile.phone).map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-muted">{item.text}</p>
                  </div>
                  <button type="button" className="text-danger" onClick={() => store.removeAddress(item.id)}>حذف</button>
                </li>
              ))}
            </ul>
            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault()
                if (text.trim().length < 8) return
                store.addAddress({ title, text, phone: addrPhone || store.profile!.phone })
                setText('')
              }}
            >
              <label className="field"><span>عنوان</span><input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
              <label className="field"><span>آدرس</span><textarea value={text} onChange={(e) => setText(e.target.value)} /></label>
              <label className="field"><span>موبایل</span><input value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} /></label>
              <Button type="submit">ذخیره آدرس</Button>
            </form>
          </div>
        )}

        {section === 'profile' && (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              store.login({ name, phone })
            }}
          >
            <h2 className="text-lg font-bold">اطلاعات حساب</h2>
            <label className="field"><span>نام</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="field"><span>موبایل</span><input value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            <Button type="submit">ذخیره</Button>
          </form>
        )}
      </section>
    </div>
  )
}

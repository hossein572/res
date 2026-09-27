import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '../components/ui.tsx'
import { TABLE_TYPES, TIME_SLOTS } from '../data/catalog.ts'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'
import { cn, formatDayKey, formatPhone, isMobile, shiftDate, toFa, todayKey } from '../utils/format.ts'

function slotFull(date: string, time: string) {
  const n = [...`${date}${time}`].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return n % 7 === 0
}

export function ReservePage() {
  useTitle('رزرو میز')
  const { reserve } = useStore()
  const [step, setStep] = useState(0)
  const [date, setDate] = useState(todayKey())
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)
  const [tableType, setTableType] = useState('window')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [doneId, setDoneId] = useState<string | null>(null)

  const days = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const dateValue = shiftDate(index)
        return {
          key: todayKey(dateValue),
          week: new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(dateValue),
          day: new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(dateValue),
        }
      }),
    [],
  )

  const submitDetails = () => {
    if (!time) return setError('ساعت را انتخاب کنید.')
    setError('')
    setStep(1)
  }

  const submitContact = () => {
    if (name.trim().length < 2) return setError('نام را وارد کنید.')
    if (!isMobile(phone)) return setError('شماره موبایل معتبر نیست.')
    setError('')
    const result = reserve({ date, time, guests, tableType, name: name.trim(), phone, note })
    setDoneId(result.id)
    setStep(2)
  }

  if (step === 2 && doneId) return <ReserveDone id={doneId} />

  return (
    <div className="wrap max-w-3xl py-8">
      <p className="text-sm text-brand-deep">رزرو میز</p>
      <h1 className="mt-1 text-[28px] font-bold">برای کدام ساعت جا نگه داریم؟</h1>
      <p className="mt-2 text-sm text-muted">میز را تا پانزده دقیقه بعد از ساعت رزرو نگه می‌داریم.</p>

      {step === 0 && (
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-sm font-semibold">تاریخ</h2>
            <div className="-mx-4 mt-2 px-4 scroller">
              {days.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={date === item.key}
                  onClick={() => setDate(item.key)}
                  className={cn('w-16 shrink-0 border py-2 text-center', date === item.key ? 'border-ink bg-ink text-white' : 'border-line')}
                >
                  <span className="block text-[11px]">{item.week}</span>
                  <span className="block text-base font-semibold">{item.day}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold">ساعت</h2>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {TIME_SLOTS.map((slot) => {
                const full = slotFull(date, slot)
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={full}
                    aria-pressed={time === slot}
                    onClick={() => setTime(slot)}
                    className={cn('h-11 border text-sm disabled:text-[#B5B5B0]', time === slot ? 'border-ink bg-ink text-white' : 'border-line')}
                  >
                    {full ? 'پر' : slot}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold">تعداد نفرات</h2>
            <div className="mt-2 flex items-center gap-3">
              <button type="button" className="grid h-11 w-11 place-items-center border border-line" onClick={() => setGuests((n) => Math.max(1, n - 1))} aria-label="کاهش">−</button>
              <span className="w-8 text-center font-semibold">{toFa(guests)}</span>
              <button type="button" className="grid h-11 w-11 place-items-center border border-line" onClick={() => setGuests((n) => Math.min(12, n + 1))} aria-label="افزایش">+</button>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold">نوع میز</h2>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {TABLE_TYPES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={tableType === item.id}
                  onClick={() => setTableType(item.id)}
                  className={cn('border p-3 text-start', tableType === item.id ? 'border-ink' : 'border-line')}
                >
                  <span className="block font-semibold">{item.label}</span>
                  <span className="mt-1 block text-sm text-muted">{item.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-4">
          <label className="field"><span>نام</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
          <label className="field"><span>شماره موبایل</span><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" /></label>
          <label className="field"><span>توضیح</span><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="اگر مناسبت خاصی است بنویسید" /></label>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-danger" role="alert">{error}</p>}
      <div className="mt-6 flex gap-2">
        {step === 1 && <Button variant="ghost" onClick={() => setStep(0)}>مرحله قبل</Button>}
        {step === 0 ? <Button onClick={submitDetails}>ادامه</Button> : <Button onClick={submitContact}>تأیید رزرو</Button>}
      </div>
    </div>
  )
}

export function ReserveDone({ id }: { id?: string }) {
  const params = useParams()
  const { reservations } = useStore()
  const reservation = reservations.find((item) => item.id === (id ?? params.id))
  useTitle('رزرو تأیید شد')
  if (!reservation) {
    return (
      <div className="wrap py-16 text-center">
        <p>رزرو پیدا نشد.</p>
        <Link to="/reserve" className="btn btn-primary mt-4">رزرو جدید</Link>
      </div>
    )
  }
  const type = TABLE_TYPES.find((item) => item.id === reservation.tableType)?.label ?? reservation.tableType
  return (
    <div className="wrap max-w-xl py-12">
      <div className="grid h-12 w-12 place-items-center bg-ok text-white"><Check className="h-6 w-6" /></div>
      <h1 className="mt-5 text-[28px] font-bold">رزرو شما ثبت شد</h1>
      <p className="mt-2 text-sm text-muted">شماره رزرو را برای پیگیری نگه دارید. میز تا ۱۵ دقیقه بعد از ساعت رزرو محفوظ است.</p>
      <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
        <div className="flex justify-between py-3"><dt className="text-muted">شماره</dt><dd className="font-bold">{toFa(reservation.number)}</dd></div>
        <div className="flex justify-between py-3"><dt className="text-muted">تاریخ</dt><dd>{formatDayKey(reservation.date)}</dd></div>
        <div className="flex justify-between py-3"><dt className="text-muted">ساعت</dt><dd>{reservation.time}</dd></div>
        <div className="flex justify-between py-3"><dt className="text-muted">نفرات</dt><dd>{toFa(reservation.guests)}</dd></div>
        <div className="flex justify-between py-3"><dt className="text-muted">میز</dt><dd>{type}</dd></div>
        <div className="flex justify-between py-3"><dt className="text-muted">موبایل</dt><dd>{formatPhone(reservation.phone)}</dd></div>
      </dl>
      <Link to="/account?section=reservations" className="btn btn-primary mt-6">رزروهای من</Link>
    </div>
  )
}

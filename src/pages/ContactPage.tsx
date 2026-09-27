import { useState } from 'react'
import { Button } from '../components/ui.tsx'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'
import { formatLandline, formatPhone, isMobile } from '../utils/format.ts'

export function ContactPage() {
  useTitle('تماس با ما')
  const { settings, addMessage } = useStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (name.trim().length < 2) return setError('نام را وارد کنید.')
    if (!isMobile(phone)) return setError('شماره موبایل معتبر نیست.')
    if (text.trim().length < 5) return setError('پیام کوتاه است.')
    addMessage({ name, phone, text })
    setSent(true)
    setError('')
  }

  return (
    <div className="wrap grid gap-10 py-8 lg:grid-cols-2 lg:py-14">
      <div>
        <h1 className="text-[28px] font-bold">تماس با ما</h1>
        <p className="mt-3 text-sm leading-8 text-muted">
          برای رزرو گروهی بالای هشت نفر یا سفارش شرکت، زنگ بزنید. پیام فرم را هم همان روز می‌خوانیم.
        </p>
        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-muted">آدرس</dt>
            <dd className="mt-1 leading-7">{settings.address}</dd>
          </div>
          <div>
            <dt className="text-muted">تلفن رستوران</dt>
            <dd className="mt-1"><a className="text-ink" href={`tel:${settings.phone}`}>{formatLandline(settings.phone)}</a></dd>
          </div>
          <div>
            <dt className="text-muted">سفارش</dt>
            <dd className="mt-1"><a className="text-ink" href={`tel:${settings.orderPhone}`}>{formatPhone(settings.orderPhone)}</a></dd>
          </div>
          <div>
            <dt className="text-muted">ساعت</dt>
            <dd className="mt-1">{settings.hours}</dd>
          </div>
        </dl>
        <div className="mt-6 border border-line bg-paper p-4 text-sm leading-7">
          <p className="font-semibold">چطور بیایید</p>
          <p className="mt-1 text-muted">از میدان فاطمی به سمت اسدآبادی، بعد از چهارراه، سمت راست. تابلوی کوچک چاشنی بالای در چوبی است.</p>
        </div>
      </div>
      <div>
        {sent ? (
          <div className="border border-line p-6">
            <h2 className="text-xl font-bold">پیام‌تان رسید</h2>
            <p className="mt-2 text-sm leading-7 text-muted">ممنون. اگر لازم باشد با همین شماره تماس می‌گیریم.</p>
          </div>
        ) : (
          <form className="space-y-4 border border-line p-4 sm:p-6" onSubmit={submit}>
            <h2 className="text-lg font-bold">پیام بگذارید</h2>
            <label className="field"><span>نام</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="field"><span>موبایل</span><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" /></label>
            <label className="field"><span>پیام</span><textarea value={text} onChange={(e) => setText(e.target.value)} /></label>
            {error && <p className="text-sm text-danger" role="alert">{error}</p>}
            <Button type="submit">ارسال پیام</Button>
          </form>
        )}
      </div>
    </div>
  )
}

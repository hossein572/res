import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui.tsx'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'
import { isMobile, toEnDigits, toFa } from '../utils/format.ts'

export function LoginPage() {
  useTitle('ورود')
  const { login } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/account'
  const [step, setStep] = useState(0)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const send = () => {
    if (!isMobile(phone)) return setError('شماره موبایل را درست وارد کنید.')
    setError('')
    setStep(1)
  }

  const verify = () => {
    if (toEnDigits(code).replace(/\D/g, '') !== '1428') return setError('کد درست نیست.')
    setError('')
    setStep(2)
  }

  const finish = () => {
    if (name.trim().length < 2) return setError('نام را وارد کنید.')
    login({ name, phone })
    navigate(next)
  }

  return (
    <div className="wrap max-w-md py-10">
      <h1 className="text-[28px] font-bold">ورود</h1>
      <p className="mt-2 text-sm leading-7 text-muted">با شماره موبایل وارد شوید. در این نسخه کد آزمایشی نمایش داده می‌شود.</p>
      {step === 0 && (
        <div className="mt-6 space-y-4">
          <label className="field"><span>شماره موبایل</span><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" /></label>
          <Button onClick={send}>دریافت کد</Button>
          <button
            type="button"
            className="text-sm text-brand-deep"
            onClick={() => {
              login({ name: 'سارا محمدی', phone: '09121234567' })
              navigate(next)
            }}
          >
            ورود آزمایشی با حساب سارا محمدی
          </button>
        </div>
      )}
      {step === 1 && (
        <div className="mt-6 space-y-4">
          <p className="bg-paper p-3 text-sm">کد آزمایشی: {toFa(1428)}</p>
          <label className="field"><span>کد چهاررقمی</span><input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" /></label>
          <Button onClick={verify}>تأیید کد</Button>
        </div>
      )}
      {step === 2 && (
        <div className="mt-6 space-y-4">
          <label className="field"><span>نام و نام خانوادگی</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
          <Button onClick={finish}>ورود به حساب</Button>
        </div>
      )}
      {error && <p className="mt-3 text-sm text-danger" role="alert">{error}</p>}
      <p className="mt-8 text-sm text-muted">
        مدیر رستوران هستید؟ <Link to="/admin/login" className="text-brand-deep">ورود به پنل</Link>
      </p>
    </div>
  )
}

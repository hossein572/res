import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo.tsx'
import { Button } from '../../components/ui.tsx'
import { useStore } from '../../context/Store.tsx'
import { useTitle } from '../../hooks/useTitle.ts'

export function AdminLoginPage() {
  useTitle('ورود مدیر')
  const { admin, adminLogin } = useStore()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  if (admin) return <Navigate to="/admin" replace />

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4">
      <form
        className="w-full max-w-sm border border-line bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault()
          if (adminLogin(password)) navigate('/admin')
        }}
      >
        <Logo />
        <h1 className="mt-5 text-xl font-bold">ورود به پنل</h1>
        <p className="mt-2 text-sm leading-7 text-muted">برای مشاهده نمونه کار، رمز «چاشنی» را وارد کنید.</p>
        <label className="field mt-5">
          <span>رمز</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
        </label>
        <Button type="submit" full className="mt-4">ورود</Button>
      </form>
    </div>
  )
}

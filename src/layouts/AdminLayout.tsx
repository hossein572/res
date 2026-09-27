import { useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  ClipboardList,
  Grid2x2,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Store,
  Users,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { Logo } from '../components/Logo.tsx'
import { useStore } from '../context/Store.tsx'
import { cn, formatDate } from '../utils/format.ts'

const LINKS = [
  { to: '/admin', label: 'داشبورد', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'سفارش‌ها', icon: ClipboardList, end: false },
  { to: '/admin/menu', label: 'مدیریت منو', icon: UtensilsCrossed, end: false },
  { to: '/admin/categories', label: 'دسته‌بندی‌ها', icon: Grid2x2, end: false },
  { to: '/admin/tables', label: 'میزها', icon: Store, end: false },
  { to: '/admin/customers', label: 'مشتریان', icon: Users, end: false },
  { to: '/admin/reports', label: 'گزارش‌ها', icon: BarChart3, end: false },
  { to: '/admin/settings', label: 'تنظیمات', icon: Settings, end: false },
]

export function AdminLayout() {
  const { admin, adminLogout, toasts, dismissToast } = useStore()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  if (!admin) return <Navigate to="/admin/login" replace />

  const nav = (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-4 py-4">
        <Logo compact />
        <p className="mt-2 text-xs text-muted">پنل مدیریت رستوران</p>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="منوی مدیریت">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 border-r-2 px-3 py-2.5 text-sm no-underline',
                isActive ? 'border-brand bg-paper font-semibold text-ink' : 'border-transparent text-muted hover:bg-paper hover:text-ink',
              )
            }
          >
            <link.icon className="h-4 w-4" aria-hidden="true" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-line p-3">
        <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted" onClick={() => navigate('/')}>
          بازگشت به سایت
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger"
          onClick={() => {
            adminLogout()
            navigate('/admin/login')
          }}
        >
          <LogOut className="h-4 w-4" />
          خروج
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-paper">
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
        <button type="button" className="grid h-11 w-11 place-items-center" aria-label="باز کردن منو" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">پنل چاشنی</span>
        <span className="text-xs text-muted">{formatDate(new Date().toISOString())}</span>
      </div>
      <div className="lg:grid lg:grid-cols-[240px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-l border-line bg-white lg:block">{nav}</aside>
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button type="button" className="absolute inset-0 bg-ink/40" aria-label="بستن منو" onClick={() => setOpen(false)} />
            <aside className="absolute inset-y-0 right-0 w-[260px] bg-white">
              <button type="button" className="absolute left-2 top-3 grid h-10 w-10 place-items-center" aria-label="بستن" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
              {nav}
            </aside>
          </div>
        )}
        <div className="min-w-0 px-4 py-5 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => dismissToast(item.id)}
            className={cn('pointer-events-auto max-w-md px-4 py-3 text-sm text-white', item.tone === 'err' ? 'bg-danger' : 'bg-ink')}
          >
            {item.message}
          </button>
        ))}
      </div>
    </div>
  )
}

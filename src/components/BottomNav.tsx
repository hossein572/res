import { ClipboardList, Heart, Home, User, UtensilsCrossed } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../utils/format.ts'

const ITEMS = [
  { to: '/', label: 'خانه', icon: Home },
  { to: '/menu', label: 'منو', icon: UtensilsCrossed },
  { to: '/account?section=orders', label: 'سفارش‌ها', icon: ClipboardList },
  { to: '/favorites', label: 'علاقه‌مندی‌ها', icon: Heart },
  { to: '/account', label: 'حساب من', icon: User },
]

export function BottomNav() {
  const { pathname, search } = useLocation()
  const active = (to: string) => {
    if (to === '/') return pathname === '/'
    if (to === '/account') return pathname === '/account' && !search.includes('section=')
    if (to.startsWith('/account?')) return pathname === '/account' && search.includes('section=orders')
    return pathname === to || pathname.startsWith(`${to}/`)
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="ناوبری پایین"
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to}
              className={cn(
                'flex h-16 flex-col items-center justify-center gap-1 px-0.5 text-center text-[9px] leading-tight no-underline',
                active(item.to) ? 'text-brand-deep' : 'text-muted',
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

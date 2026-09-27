import { Search, ShoppingBag, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/Store.tsx'
import { toFa } from '../utils/format.ts'
import { Logo } from './Logo.tsx'

const LINKS = [
  { to: '/menu', label: 'منو' },
  { to: '/about', label: 'درباره ما' },
  { to: '/reserve', label: 'رزرو میز' },
  { to: '/contact', label: 'تماس با ما' },
]

export function Header({ onSearch }: { onSearch: () => void }) {
  const { cartCount, profile } = useStore()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="wrap flex h-[60px] items-center gap-3 md:gap-6">
        <Logo compact />
        <nav className="hidden items-center gap-5 text-sm md:flex" aria-label="منوی اصلی">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="text-ink no-underline hover:text-brand-deep">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center">
          <button type="button" className="grid h-11 w-11 place-items-center" aria-label="جستجوی غذا" onClick={onSearch}>
            <Search className="h-5 w-5" />
          </button>
          <Link to="/cart" className="relative grid h-11 w-11 place-items-center text-ink" aria-label={`سبد خرید، ${toFa(cartCount)} مورد`}>
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span key={cartCount} className="pop absolute left-1 top-1 grid h-[18px] min-w-[18px] place-items-center bg-brand px-1 text-[10px] font-bold text-white">
                {toFa(cartCount)}
              </span>
            )}
          </Link>
          <Link
            to={profile ? '/account' : '/login'}
            className="grid h-11 w-11 place-items-center text-ink md:hidden"
            aria-label={profile ? 'حساب کاربری' : 'ورود'}
          >
            <User className="h-5 w-5" />
          </Link>
          <Link to={profile ? '/account' : '/login'} className="btn btn-ghost ms-1 hidden h-10 min-h-10 px-3 text-sm md:inline-flex">
            {profile ? profile.name.split(' ')[0] : 'ورود'}
          </Link>
        </div>
      </div>
    </header>
  )
}

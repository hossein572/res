import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav.tsx'
import { Footer } from '../components/Footer.tsx'
import { Header } from '../components/Header.tsx'
import { SearchSheet } from '../components/SearchSheet.tsx'
import { useStore } from '../context/Store.tsx'
import { cn } from '../utils/format.ts'

export function SiteLayout() {
  const { pathname } = useLocation()
  const { toasts, dismissToast } = useStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const hideNav = /^\/(cart|checkout|food|order|track|reserve|login)/.test(pathname)
  const hideFooter = /^\/(checkout)/.test(pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
    setSearchOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a href="#main" className="skip-link right-3 top-3">
        رفتن به محتوا
      </a>
      <Header onSearch={() => setSearchOpen(true)} />
      <main id="main" className={cn('flex-1', !hideNav && 'pb-[76px] md:pb-0')}>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      {!hideNav && <BottomNav />}
      <SearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} />
      <div className="pointer-events-none fixed inset-x-0 top-[68px] z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => dismissToast(item.id)}
            className={cn(
              'pointer-events-auto rise max-w-md px-4 py-3 text-sm text-white',
              item.tone === 'err' ? 'bg-danger' : 'bg-ink',
            )}
          >
            {item.message}
          </button>
        ))}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { cn } from '../utils/format.ts'

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2.5 no-underline', light ? 'text-white' : 'text-ink')} aria-label="چاشنی، صفحه اصلی">
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        <rect width="32" height="32" fill="#C85A3F" />
        <path d="M7.5 15.2h17c-.6 5.6-4.4 8.8-8.5 8.8s-7.9-3.2-8.5-8.8z" fill="none" stroke="#fff" strokeWidth="1.6" />
        <path d="M16 14.2c2-2.7 3-4.6 3-4.6s-1.6 2.6-3 4.6z" fill="#F3B562" />
        <path d="M12.2 8.6c1.6 1.8 2.4 3.4 2.3 5" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span className="block text-[19px] font-bold tracking-tight">چاشنی</span>
        {!compact && (
          <span className={cn('mt-1 hidden text-[10px] font-medium sm:block', light ? 'text-white/70' : 'text-muted')}>
            طعم خوب، حال خوب
          </span>
        )}
      </span>
    </Link>
  )
}

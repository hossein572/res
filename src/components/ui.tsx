import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Minus, Plus, Star } from 'lucide-react'
import { cn, foodSrc, formatPrice, toFa } from '../utils/format.ts'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  full?: boolean
  loading?: boolean
}

export function Button({ variant = 'primary', full, loading, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={cn('btn', `btn-${variant}`, full && 'w-full', className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'لطفاً صبر کنید…' : children}
    </button>
  )
}

export function ButtonLink({
  to,
  variant = 'primary',
  full,
  className,
  children,
}: {
  to: string
  variant?: 'primary' | 'secondary' | 'ghost'
  full?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <Link to={to} className={cn('btn', `btn-${variant}`, full && 'w-full', className)}>
      {children}
    </Link>
  )
}

export function Price({ value, old, className }: { value: number; old?: number; className?: string }) {
  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-2', className)}>
      <span>{formatPrice(value)}</span>
      {old != null && old > value && <span className="text-[12px] font-normal text-muted line-through">{formatPrice(old)}</span>}
    </span>
  )
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] text-ink">
      <Star className="h-3.5 w-3.5 fill-[#C8922A] text-[#C8922A]" aria-hidden="true" />
      <span>{toFa(value.toFixed(1))}</span>
      {count != null && <span className="text-muted">({toFa(count)})</span>}
    </span>
  )
}

export function Qty({
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className="inline-flex items-center border border-line bg-white">
      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-ink disabled:text-[#C2C2BE]"
        aria-label="کاهش تعداد"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-7 text-center text-sm font-semibold">{toFa(value)}</span>
      <button
        type="button"
        className="grid h-11 w-11 place-items-center text-ink disabled:text-[#C2C2BE]"
        aria-label="افزایش تعداد"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

export function Photo({
  src,
  alt,
  className,
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  eager?: boolean
}) {
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState(false)
  const url = foodSrc(src)

  return (
    <span className={cn('relative block overflow-hidden bg-[#EFEFEC]', className)}>
      {!ok && !err && <span className="absolute inset-0 animate-pulse bg-[#E8E8E5]" aria-hidden="true" />}
      {err ? (
        <span className="absolute inset-0 grid place-items-center px-2 text-center text-[11px] text-muted">تصویر در دسترس نیست</span>
      ) : (
        <img
          src={url}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setOk(true)}
          onError={() => setErr(true)}
          className={cn('h-full w-full object-cover transition-opacity duration-300', ok ? 'opacity-100' : 'opacity-0')}
        />
      )}
    </span>
  )
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="px-4 py-16 text-center">
      <h2 className="text-lg font-bold">{title}</h2>
      {text && <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-muted">{text}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

export function ErrorState({
  title = 'مشکلی پیش آمد',
  text = 'این بخش درست بارگذاری نشد.',
  onRetry,
}: {
  title?: string
  text?: string
  onRetry?: () => void
}) {
  return (
    <div className="px-4 py-16 text-center" role="alert">
      <AlertCircle className="mx-auto h-8 w-8 text-danger" aria-hidden="true" />
      <h2 className="mt-3 text-lg font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-muted">{text}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary mt-5" onClick={onRetry}>
          تلاش دوباره
        </button>
      )}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-[#EFEFEC]', className)} aria-hidden="true" />
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="بستن" onClick={onClose} />
      <div className="rise relative max-h-[92vh] w-full overflow-auto bg-white p-5 sm:max-w-lg">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" className="grid h-10 w-10 place-items-center text-muted" onClick={onClose} aria-label="بستن پنجره">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ErrorBoundaryFallback() {
  return <ErrorState title="مشکلی پیش آمد" text="صفحه درست بارگذاری نشد. یک بار دیگر تلاش کنید." onRetry={() => location.reload()} />
}

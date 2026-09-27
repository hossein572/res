import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/Store.tsx'
import { normalize } from '../utils/format.ts'
import { Photo, Price } from './ui.tsx'

export function SearchSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { foods } = useStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const results = useMemo(() => {
    const q = normalize(query)
    if (!q) return foods.filter((food) => food.popular).slice(0, 6)
    return foods.filter((food) => normalize(`${food.name} ${food.description} ${food.ingredients.join(' ')}`).includes(q)).slice(0, 8)
  }, [foods, query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-white" role="dialog" aria-modal="true" aria-label="جستجوی غذا">
      <div className="wrap flex h-[60px] items-center gap-2">
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="نام غذا، مثلاً جوجه یا پپرونی"
          className="control"
          aria-label="جستجوی غذا"
        />
        <button type="button" className="btn btn-ghost h-12 shrink-0 px-3" onClick={onClose}>
          بستن
        </button>
      </div>
      <div className="wrap pb-10">
        <p className="mb-3 text-sm text-muted">{query.trim() ? 'نتیجه جستجو' : 'پیشنهادهای چاشنی'}</p>
        {results.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">غذایی با این نام پیدا نشد.</p>
        ) : (
          <ul className="divide-y divide-line">
            {results.map((food) => (
              <li key={food.id}>
                <Link to={`/food/${food.id}`} onClick={onClose} className="flex items-center gap-3 py-3 text-ink no-underline">
                  <Photo src={food.image} alt="" className="h-14 w-14 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{food.name}</span>
                    <span className="block truncate text-[13px] text-muted">{food.description}</span>
                  </span>
                  <Price value={food.price} className="shrink-0 text-sm font-semibold" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

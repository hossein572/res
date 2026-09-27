import { Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/Store.tsx'
import type { Food } from '../types/index.ts'
import { cn } from '../utils/format.ts'
import { Photo, Price, Rating } from './ui.tsx'

export function FoodCard({ food, variant = 'grid' }: { food: Food; variant?: 'grid' | 'row' | 'scroll' }) {
  const { favorites, toggleFav, addToCart } = useStore()
  const fav = favorites.includes(food.id)

  const favButton = (
    <button
      type="button"
      aria-label={fav ? `حذف ${food.name} از علاقه‌مندی` : `افزودن ${food.name} به علاقه‌مندی`}
      aria-pressed={fav}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFav(food.id)
      }}
      className="grid h-9 w-9 place-items-center bg-white/95 text-ink"
    >
      <Heart className={cn('h-4 w-4', fav && 'fill-brand text-brand')} />
    </button>
  )

  const addButton = (
    <button
      type="button"
      aria-label={`افزودن ${food.name} به سبد`}
      disabled={!food.available}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        addToCart({ food })
      }}
      className="grid h-9 w-9 shrink-0 place-items-center bg-brand-deep text-white disabled:bg-[#E4E4E1] disabled:text-muted"
    >
      <Plus className="h-4 w-4" />
    </button>
  )

  if (variant === 'row') {
    return (
      <article className="flex gap-3 border-b border-line py-3">
        <Link to={`/food/${food.id}`} className="relative shrink-0">
          <Photo src={food.image} alt={food.name} className={cn('h-24 w-24', !food.available && 'grayscale')} />
          {!food.available && (
            <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-0.5 text-center text-[10px] text-white">ناموجود</span>
          )}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/food/${food.id}`} className="font-semibold leading-6 text-ink no-underline">
              {food.name}
            </Link>
            {favButton}
          </div>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-6 text-muted">{food.description}</p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <div>
              <Rating value={food.rating} />
              <Price value={food.price} className="mt-0.5 block text-sm font-semibold" />
            </div>
            {addButton}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className={cn('group', variant === 'scroll' && 'w-[220px] shrink-0')}>
      <div className="relative overflow-hidden">
        <Link to={`/food/${food.id}`} className="block">
          <Photo
            src={food.image}
            alt={food.name}
            className={cn('aspect-[4/3] transition-transform duration-300 group-hover:scale-[1.03]', !food.available && 'grayscale')}
          />
        </Link>
        <span className="absolute left-2 top-2">{favButton}</span>
        {!food.available && (
          <span className="pointer-events-none absolute bottom-2 right-2 bg-ink px-2 py-0.5 text-[11px] text-white">ناموجود</span>
        )}
      </div>
      <div className="pt-2.5">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/food/${food.id}`} className="font-semibold leading-6 text-ink no-underline group-hover:text-brand-deep">
            {food.name}
          </Link>
          <Rating value={food.rating} />
        </div>
        <p className="mt-1 line-clamp-2 min-h-10 text-[13px] leading-5 text-muted">{food.description}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <Price value={food.price} className="text-sm font-semibold" />
          {addButton}
        </div>
      </div>
    </article>
  )
}

import { FoodCard } from '../components/FoodCard.tsx'
import { ButtonLink, EmptyState } from '../components/ui.tsx'
import { useStore } from '../context/Store.tsx'
import { useTitle } from '../hooks/useTitle.ts'

export function FavoritesPage() {
  useTitle('علاقه‌مندی‌ها')
  const { foods, favorites } = useStore()
  const list = foods.filter((food) => favorites.includes(food.id))

  return (
    <div className="wrap py-6 md:py-10">
      <h1 className="text-[28px] font-bold">علاقه‌مندی‌ها</h1>
      {list.length === 0 ? (
        <EmptyState title="هنوز غذایی به علاقه‌مندی‌ها اضافه نکرده‌اید." action={<ButtonLink to="/menu">مشاهده منو</ButtonLink>} />
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {list.map((food) => (
            <div key={food.id} className="min-[380px]:hidden">
              <FoodCard food={food} variant="row" />
            </div>
          ))}
          {list.map((food) => (
            <div key={`${food.id}-g`} className="hidden min-[380px]:block">
              <FoodCard food={food} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

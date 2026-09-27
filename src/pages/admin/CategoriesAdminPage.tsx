import { useState } from 'react'
import { Button } from '../../components/ui.tsx'
import { useStore } from '../../context/Store.tsx'
import { useTitle } from '../../hooks/useTitle.ts'
import { toFa, uid } from '../../utils/format.ts'

export function CategoriesAdminPage() {
  useTitle('دسته‌بندی‌ها')
  const { categories, foods, saveCategory, removeCategory } = useStore()
  const [name, setName] = useState('')
  const [short, setShort] = useState('')

  return (
    <div>
      <h1 className="text-2xl font-bold">دسته‌بندی‌ها</h1>
      <ul className="mt-5 divide-y divide-line bg-white">
        {categories.map((category) => {
          const count = foods.filter((food) => food.categoryId === category.id).length
          return (
            <li key={category.id} className="flex flex-wrap items-center gap-3 p-3">
              <input
                className="control h-10 max-w-[180px]"
                defaultValue={category.name}
                key={category.name}
                aria-label={`نام ${category.name}`}
                onBlur={(event) => saveCategory({ ...category, name: event.target.value })}
              />
              <span className="text-sm text-muted">{toFa(count)} غذا</span>
              <button type="button" className="text-sm" onClick={() => saveCategory({ ...category, visible: !category.visible })}>
                {category.visible ? 'مخفی کردن' : 'نمایش'}
              </button>
              <button type="button" className="text-sm text-danger" onClick={() => removeCategory(category.id)}>حذف</button>
            </li>
          )
        })}
      </ul>
      <form
        className="mt-6 grid gap-3 bg-white p-4 sm:grid-cols-[1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault()
          if (name.trim().length < 2) return
          saveCategory({ id: uid('cat'), name: name.trim(), short: short.trim() || name.trim(), image: 'hero.jpg', visible: true })
          setName('')
          setShort('')
        }}
      >
        <label className="field"><span>نام دسته</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className="field"><span>نام کوتاه</span><input value={short} onChange={(e) => setShort(e.target.value)} /></label>
        <Button type="submit" className="self-end">افزودن</Button>
      </form>
    </div>
  )
}
